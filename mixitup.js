// To keep our code clean and modular, all custom functionality will be contained inside a single object literal called "mixitupConfig".

var mixitupConfig = {

    // Declare any variables we will need as properties of the object
    layout: 'Grid',
    $filters: null,
    $reset: null,
    groups: [],
    outputArray: [],
    outputString: '',

    // The "init" method will run on document ready and cache any jQuery objects we will need.

    load: function () {
        this.$container.mixItUp({
            controls: {
                enable: false // we won't be needing these
            },
            layout: {
						containerClass: 'Grid' // Add the class 'list' to the container on load
					},
            callbacks: {
                onMixFail: function () {
                    alert('No items were found matching the selected filters.');
                }
            }
        });
    },

    init: function (container, filters, reset, changeLayout) {
        var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "buttonFilter" object so that we can share methods and properties between all parts of the object.

        if (container === undefined) { container = "#Container"; }
        if (reset === undefined) { reset = '.Reset'; }
        if (filters === undefined) { filters = '#Filters'; }
        if (changeLayout === undefined) { changeLayout = '#ChangeLayout'; }

        self.$filters 		= $(filters);
        self.$reset 	 	= $(reset);
        self.$container 	= $(container);
        self.$changeLayout 	= $(changeLayout);

        self.$filters.find('.form-group').each(function () {
            self.groups.push({
                $buttons: $(this).find('.filter'),
                active: ''
            });
        });

        self.bindHandlers();
    },

    // The "bindHandlers" method will listen for whenever a button is clicked. 

    bindHandlers: function () {
        var self = this;

        // Handle filter clicks
        self.$filters.on('click', '.filter', function (e) {
            e.preventDefault();
            var $button = $(this);
            // If the button is active, remove the active class, else make active and deactivate others.
            if ($button.hasClass('active')) {
                $button.removeClass('active');
            }
            else {
                $button.parent().parent().children().find('.filter').removeClass('active');
                $button.parent().parent().children().find('.Reset').removeClass('active');
                $button.addClass('active');
            }
            self.parseFilters();
        });

        // Handle reset click
        self.$reset.on('click', function (e) {
            e.preventDefault();
            var $button = $(this);
            $button.parent().parent().children().find('.filter').removeClass('active');
            $button.addClass('active');
            // self.$filters.find('.filter').removeClass('active');
            self.parseFilters();
        });

        self.$changeLayout.on('click', function () {
            // If the current layout is a list, change to grid:

            if (self.layout == 'list')
			{
                self.layout = 'grid';
                self.$changeLayout.removeClass('glyphicon-th').addClass('glyphicon-align-justify'); // Update the button text
                self.$container.mixItUp('changeLayout', {
                    containerClass: self.layout // change the container class to "grid"
                });
                // Else if the current layout is a grid, change to list:  

            } else {
                self.layout = 'list';
                self.$changeLayout.removeClass('glyphicon-align-justify').addClass('glyphicon-th'); // Update the button text
                self.$container.mixItUp('changeLayout', {
                    containerClass: self.layout // Change the container class to 'list'
                });
            }
        });
    },

    // The parseFilters method checks which filters are active in each group:

    parseFilters: function () {
        var self = this;
        // loop through each filter group and grap the active filter from each one.
        for (var i = 0, group; group = self.groups[i]; i++)
		{
            group.active = group.$buttons.filter('.active').attr('data-filter') || '';
        }
        self.concatenate();
    },

    // The "concatenate" method will crawl through each group, concatenating filters as desired:
    concatenate: function () {
        var self = this;
        self.outputString = ''; // Reset output string
        for (var i = 0, group; group = self.groups[i]; i++) {
            self.outputString += group.active;
        }

        // If the output string is empty, show all rather than none:
        !self.outputString.length && (self.outputString = 'all');
        //console.log(self.outputString);
        // ^ we can check the console here to take a look at the filter string that is produced
        // Send the output string to MixItUp via the 'filter' method:

        if (self.$container.mixItUp('isLoaded')) {
            self.$container.mixItUp('filter', self.outputString);
        }
    }
};

mixitupConfig.init();
mixitupConfig.load();