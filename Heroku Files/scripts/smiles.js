
var Smile = (function() {

    // PRIVATE VARIABLES
        
    // The backend we'll use for Part 2. For Part 3, you'll replace this 
    // with your backend.
   //var apiUrl = 'https://smile451.herokuapp.com';  //Ruby on Rails backend
    //var apiUrl = 'https://arslanay-warmup.herokuapp.com';    //Flask-Python backend
    //var apiUrl = 'http://localhost:5000'; //backend running on localhost
    var apiUrl = 'https://sschuur-warmup.herokuapp.com'
    // FINISH ME (Task 4): You can use the default smile space, but this means
    //            that your new smiles will be merged with everybody else's
    //            which can get confusing. Change this to a name that 
    //            is unlikely to be used by others. 
    var smileSpace = 'initial'; // The smile space to use. 


    var smiles; // smiles container, value set in the "start" method below
    var smileTemplateHtml; // a template for creating smiles. Read from index.html
                           // in the "start" method
    var create; // create form, value set in the "start" method below


    // PRIVATE METHODS
      
   /**
    * HTTP GET request 
    * @param  {string}   url       URL path, e.g. "/api/smiles"
    * @param  {function} onSuccess   callback method to execute upon request success (200 status)
    * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
    * @return {None}
    */
   var makeGetRequest = function(url, onSuccess, onFailure) {
       $.ajax({
           type: 'GET',
           url: apiUrl + url,
           dataType: "json",
           success: onSuccess,
           error: onFailure
       });
   };

    /**
     * HTTP POST request
     * @param  {string}   url       URL path, e.g. "/api/smiles"
     * @param  {Object}   data      JSON data to send in request body
     * @param  {function} onSuccess   callback method to execute upon request success (200 status)
     * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
     * @return {None}
     */
    var makePostRequest = function(url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };
        
    /**
     * Insert smile into smiles container in UI
     * @param  {Object}  smile       smile JSON
     * @param  {boolean} beginning   if true, insert smile at the beginning of the list of smiles
     * @return {None}
     */
    var insertSmile = function(smile, beginning) {
        // Start with the template, make a new DOM element using jQuery
        var newElem = $(smileTemplateHtml);
        // Populate the data in the new element
        // Set the "id" attribute 
        newElem.attr('id', smile.id); 
        // Now fill in the data that we retrieved from the server
        newElem.find('.title').text(smile.title);
       

        newElem.find('.story').text(smile.story);
        newElem.find('.happiness-level').addClass('happiness-level-' + parseInt(smile.happiness_level));
        newElem.find('.count').text(smile.like_count);
        newElem.find('.timestamp').text(smile.created_at);


        if (beginning) {
            smiles.prepend(newElem);
        } else {
            smiles.append(newElem);
        }
    };


     /**
     * Get recent smiles from API and display 10 most recent smiles
     * @return {None}
     */
    var displaySmiles = function() {
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function (data) {
            for (i = 0; i < data.smiles.length; i++)insertSmile(data.smiles[i], true);
            console.log(data);
        };
        var onFailure = function() { 
            console.error('display smiles failed'); 
        };
        makeGetRequest("/api/smiles?space=initial&count=500&order_by=created_at", onSuccess, onFailure);
    };

    /**
     * Add event handlers for clicking like.
     * @return {None}
     */
    var attachLikeHandler = function(e) {
        // Attach this handler to the 'click' action for elements with class 'like'
        smiles.on('click', '.like', function(e) {
            // FINISH ME (Task 3): get the id of the smile clicked on to use in the POST request

            //var smileId = '123'; 
            var smileId = $(this).parents(".smile").attr("id"); 
            // Prepare the AJAX handlers for success and failure
           
            var onSuccess = function(data) {
                /* FINISH ME (Task 3): update the like count in the UI */
             
                document.getElementById(smileId).querySelector('.count').textContent++;
               // console.log(data);
               
            };
            var onFailure = function() { 
                console.error('like smile error'); 
            };

            //var val = $(e.target).parents('article').attr('id');
            makePostRequest("/api/smiles/"+smileId+"/like", null, onSuccess, onFailure);
        });
    };


    /**
     * Add event handlers for submitting the create form.
     * @return {None}
     */
    var attachCreateHandler = function (e) {
        // First, hide the form, initially 
        console.log("HIDE FORM");
        create.find('form').hide();

        create.on('click', '.share-smile', function (e) {
            create.find('form').show();
            console.log("SHOW FORM");
            create.find('.share-smile').hide();
            //create.find('.smiles').hide();
            });
            
        create.on('click', '.return', function (e) {
            create.find('form').hide();
            console.log("HIDE FORM RETURN");
            create.find('.share-smile').show();
            smiles.show();
        });

        // The handler for the Post button in the form
        create.on('click', '.submit-input', function (e)
        {
            console.log("");
            e.preventDefault(); // Tell the browser to skip its default click action

           
            var smile = {}; // Prepare the smile object to send to the server
            smile.title = create.find('.title-input').val();
            smile.story = create.find('.story-input').val();
            smile.happiness_level = create.find('.happiness-level-input').val();
            smile.like_count = 0;
            smile.space = smileSpace;

            if (smile.title.length <= 0 || smile.title.length > 64) {
                alert("ERROR: Title cannot be empty or longer than 64 characters")
                return;
            }

            if (smile.story.length <= 0 || smile.story.length > 2048) {
                alert("ERROR: Story cannot be empty or longer than 2048 characters")
                return;
            }

            //smile.happiness_level = parseInt(create.find('.happiness-level-input').val());
            if (smile.happiness_level <= 0 || smile.happiness_level > 3) {
                alert("ERROR: Happiness level is beyond range")
                return;
            }

           // console.log(smile);
            var onSuccess = function (data) {
                //insertSmile(data.smile, true);
                // FINISH ME (Task 4): insert smile at the beginning of the smiles container
                console.log("success");
                insertSmile(data.smile, true);
                create.find('form').hide();
                create.find('.share-smile').show();
                smiles.show();
            };
            var onFailure = function () {
                console.log("fail smile");
                console.error('create smile failed');
            };

            // FINISH ME (Task 4): make a POST request to create the smile, then 
            //            hide the form and show the 'Shared a smile...' button
            
            makePostRequest("/api/smiles", smile, onSuccess, onFailure);
            
        });

    };


    
    /**
     * Start the app by displaying the most recent smiles and attaching event handlers.
     * @return {None}
     */
    var start = function() {
        smiles = $(".smiles");
        create = $(".create");

        // Grab the first smile, to use as a template
        smileTemplateHtml = $(".smiles .smile")[0].outerHTML;
        // Delete everything from .smiles
        smiles.html('');

        displaySmiles();
        attachLikeHandler();
        attachCreateHandler();
    };
    

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Smile.key_name, e.g. Smile.start()
    return {
        start: start
    };
    
})();
