/**
 * @ngdoc controller
 * @name translate.nodes.sendController
 * @function
 *
 * @description
 * Controller for the Send to translation dialog
 */

(function () {
    'use strict';

    function nodeSendController(
        $scope,
        $routeParams,
        notificationsService,
        navigationService,
        dialogService,
        translateNodeService,
        translateSetService,
        translateJobService,
        translateHub) {

        var vm = this;

        vm.nodeName = $scope.currentNode.name;
        vm.hasChildren = $scope.currentNode.hasChildren;
        vm.currentNode = $scope.currentNode;

        vm.busy = true;
        vm.busyMsg = "processing";

        vm.error = false; 
        vm.success = false; 
        vm.nodecheck = false;

        vm.sendtoview = true;

        // steps 'pick', 'targets', 'job', 'done'
        vm.step = 'pick';

        vm.sentview = "Sent";

        vm.nodeItems = [];

        vm.loadSet = loadSet;

        vm.check = check;
        vm.approveWarning = approveWarning;
        vm.createNodes = createNodes;
        vm.createJobs = createJobs;

        vm.autoSend = false; 

        vm.navigateToJob = navigateToJob;

        translateHub.initHub(function (hub) {
            vm.msgHub = hub;

            vm.msgHub.on('Add', function (data) {
                vm.update = data
            });

            vm.msgHub.start();
        });

        vm.job = {
            Name: "Translations $language$ " + new Date().toLocaleString(),
            TargetCulture: {},
            ProviderProperties: {},
            Provider: null,
            Status: 'Pending'
        };

        vm.createOptions = {
            singleProvider: false,
            key: ""
        };

        vm.node = $scope.dialogOptions.currentNode;
        vm.sets = [];

        vm.options = {
            children: vm.hasChildren,
            unpublished: vm.hasChildren,
            sites: []
        };

        // init       
        vm.loadSet(vm.node.id)
        ///////////////////

        function check() {
            vm.busy = true;

            var sites = getSelectedSites(vm.sets);
            
            translateSetService.getTargets(vm.node.id, sites)
                .then(function (result) {
                    vm.warning = false;
                    vm.mismatch = false;

                    vm.targets = result.data;

                    checkSiteTargets(vm.sets);

                    if (vm.mismatch || vm.warning) {
                        // there are some missing nodes
                        // so we tell the user
                        vm.step = 'targets';
                        vm.busy = false; 
                    }
                    else {
                        if (vm.userAutoSend)
                        {
                            // create the nodes and job 
                            // user will see the create job dialog

                            // add some nodes so the job view can tell what we are doing
                            vm.nodeItems.push({ MasterNodeName: vm.node.name });
                            if (vm.options.children == true) {

                                if (vm.currentNode.children != undefined)
                                {
                                    vm.currentNode.children.forEach(function (child) {
                                        vm.nodeItems.push({ MasterNodeName: child.name });
                                    });
                                }

                                vm.nodeItems.push({ MasterNodeName: "+ all child pages", Generic: true });
                            }
                            vm.step = 'job';
                            vm.busy = false; 
                        }
                        else {
                            // just push the nodes 
                            vm.createNodes();
                        }
                    }
                }, function (error) {
                    notificationsService.error("error", error.data.ExceptionMessage);
                });
        }

        function getTarget(id) {

            var result = 0;

            vm.targets.map(function (target) {
                if (target.SiteId == id) {
                    result = target;
                }
            });

            return result;
        }

        function approveWarning() {
            if (vm.userAutoSend) {
                vm.step = 'job';
            }
            else {
                vm.createNodes();
            }
        }

        function createNodes () {

            vm.busy = true;
            vm.update = "Extracting translation content";

            vm.options.sites = [];

            vm.sets.forEach(function (set) {
                set.Sites.forEach(function (site) {
                    if (site.checked === true) {
                        vm.options.sites.push(
                            {
                                siteId: site.Id,
                                cultureId: site.CultureId
                            });
                    }
                })
            });

            translateNodeService.create(vm.node.id, vm.options)
                .then(function (result) {
                    vm.step = 'done';
                    vm.nodes = result.data;
                    if (vm.userAutoSend) {
                        createJobs(vm.nodes);
                    }
                    else {
                        vm.busy = false;
                    }
                }, function (error) {
                    vm.error = {
                        errorMsg: "Failed",
                        data: error.data
                    };
                    vm.busy = false;
                });
        }

        // create the translations job
        function createJobs(nodes) {

            vm.nodeGroups = [];
            vm.jobs = [];

            if (nodes == undefined || nodes.length == 0) {
                // no nodes where created.
                vm.error = {
                    errorMsg: "No items",
                    data: { message: "No translation items have been created, so we cannot create a translation job" },
                };
                vm.step = 'done';
                vm.busy = false;
                return;
            }

            vm.busy = true;
            vm.update = "Submitting Translations";

            // group the nodes
            vm.nodeGroups = groupNodes(vm.nodes);

            // we submit a job for each of the node groups we have. 
            vm.nodeGroups.forEach(function (group) {

                group.status = 'submitted';

                translateJobService.create(group.jobName, group.nodes, vm.job.provider.Key, vm.job.ProviderProperties)
                    .then(function (result) {
                        vm.busy = false;
                        vm.jobs.push(result.data);
                        group.status = 'complete';
                    }, function (error) {
                        vm.error = {
                            errorMsg: "Failed",
                            data: error.data
                        };
                        group.status = 'failed';
                    });

                vm.busy = false;
            });
        }

        function loadSet (id) {
            translateSetService.getByNode(id)
                .then(function (result) {
                    vm.sets = result.data;
                    vm.busy = false;
                }, function (error) {
                    notificationsService
                        .error("load", "can't find the set for this node");
                });
        }

        /////////////////
        $scope.$watch('vm.options.children', function (newValue, oldValue) {
            if (newValue == false) {
                vm.options.unpublished = false;
            }
        });


        /////////////////

        // groups the nodes, by culture
        function groupNodes(nodes) {
            var nodeGroups = [];

            nodes.map(function (node) {
                var found = false
                nodeGroups.map(function (group) {
                    if (group.id == node.Culture.LCID) {
                        group.nodes.push(node);
                        found = true;
                    }
                });
                if (!found) {
                    var newGroup = {
                        id: node.Culture.LCID,
                        name: node.Culture.DisplayName,
                        nodes: [],
                        status: 'pending',
                        jobName: vm.job.Name.replace("$language$", node.Culture.DisplayName)
                    };
                    newGroup.nodes.push(node);
                    nodeGroups.push(newGroup);
                }
            });

            return nodeGroups;
        }

        function getAutoSendSettings(sets) {

            var selectedSets = [];
            var singleSet = {};

            sets.forEach(function (set) {
                set.Sites.forEach(function (site) {
                    if (site.checked === true) {
                        if (selectedSets.indexOf(set.Id) == -1) {
                            selectedSets.push(set.Id);
                            singleSet = set;
                        }
                    }
                })
            });

            // we can't autosend when there is more than one set.
            if (selectedSets.length > 1) {
                vm.autoSend = false;
            }
            else {
                // this will come from the set. 
                vm.autoSend = singleSet.AutoSend;
                vm.createOptions.singleProvider =
                    singleSet.ProviderKey != "00000000-0000-0000-0000-000000000000";
                vm.createOptions.key = singleSet.ProviderKey;
            }

            vm.userAutoSend = vm.autoSend;
        }

        function getSelectedSites(sets) {
            var sites = [];

            sets.forEach(function (set) {
                set.Sites.forEach(function (site) {
                    if (site.checked === true) {
                        sites.push(site.Id);
                    }
                });
            });

            return sites;
        }

        function checkSiteTargets(sets) {
            vm.sets.forEach(function (set) {
                set.Sites.forEach(function (site) {
                    if (site.checked === true) {
                        site.target = getTarget(site.Id);
                        if (site.target.TargetId === 0 || site.target === 0) {
                            vm.warning = true;
                            if (site.target.ParentId === 0 || site.target === 0) {
                                vm.mismatch = true;
                            }
                        }
                    }
                });
            })
        }

        function navigateToJob(jobId) {
            navigationService.hideDialog();
            window.location.href = "#/translatePlus/tp/job/" + jobId;
        }

        $scope.$watch("vm.sets", function (newValue, oldValue) {

            if (newValue != undefined && vm.userAutoSend == undefined) {
                getAutoSendSettings(newValue);
            }

        }, true);
    }

    angular.module("umbraco")
        .controller("translate.sendController", nodeSendController);

})();

