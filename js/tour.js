var fabmo = new FabMoDashboard();

var tour = document.getElementById('tour-container');

var currentLeft = 0;
var counter = 0;
var cardWidth = $(window).width();
var lastStat = null;


var content = [
    {
        "id": "1",
        "image": "images/Desktopmax.jpg",
        "header": "Welcome to Fabmo",
        "text": "We are excited to get you up and running with your Desktop Max",
        "actionText" : "",
        "action": ""
 
    },
     {
        "id": "2",
        "input": "Tool Name",
        "header": "First we will start to customize your tool",
        "text": "We will start by creating a custom name for your tool. Enter a recognizable name and click submit. This will be displayed on the wifi network and on tool locators when connecting to your tool.",
        "actionText" : "Submit",
        "action": function() {
            var id  = $('#card-'+content[1].id +' input').val();
            var name = {name: id};
            fabmo.setNetworkIdentity(name, function(err, data) {
                if(err){
                    console.log(err);
                } else {
                    fabmo.getNetworkIdentity(function(err, data) {});
                }
                
            })
    }
    },
    {
         "id": "3",
        "video": "images/square-dtm.mp4",
        "header": "Square Tool",
        "text": "Next we will run a routine to re-sqaure your tool incase it moved during shipping. The tool will move so make sure work area is clear. It will also make a loud noise when it makes contact with the end of the work space THIS IS NORMAL. Click Square to run the routine.",
        "actionText" : "Square",
        "action": function() {fabmo.runSBP('C#,8')}
    },
    {
        "id": "4",
        "video": "images/home-dtm.mp4",
        "header": "Home Your Tool",
        "text": "Your X is zeroed from the last step, but lets go ahead and zero your Y axis. It's important to get into the habit of running this routine when you start up your machine to make sure the zeros are where you think they are",
        "actionText" : "Set X and Y Zeros",
        "action": function() {fabmo.runSBP('C#,3');

           fabmo.on('status', onStatus);
            
        }
    },
]

var bitNo = [
    {
        "id": "5",
        "video": "images/rabbet-dtm.mp4",
        "header": "No bit, that's okay",
        "text": "We will go ahead and run an aircut and take you through the job manager so you can understand how to submit and run jobs.",
        "actionText" : "Submit Air Cut",
        "action": function() {
            DoJobFile ();
        }
    },

]

var bitYes = [
    {
        "id": "5",
        "video": "images/center-dtm.mp4",
        "header": "Move to center of board",
        "text": "We are going to put a bit in the spindle and zero the z-axis. To give us some room we are gonna move the head to the center of the work area. ",
        "actionText" : "Move to center",
        "action": function() {
            
            fabmo.runSBP('J2, 18, 12');
            
        }
    },
    {
        "id": "6",
        "video": "images/remove-c-dtm.mp4",
        "header": "Remove collet nut",
        "text": "Place your fingers high on the spindle shaft and rotate the collet nut clock-wise with your other hand. ",
        "actionText" : "Move to center",
        "action": ""
    },
    {
        "id": "7",
        "video": "images/insert-c-dtm.mp4",
        "header": "Insert collet in collet nut",
        "text": "Place your 1/4 inch collet into the collet nut, you should feel a mild snap.",
        "actionText" : "Move to center",
        "action": ""
    },
     {
        "id": "8",
        "video": "images/insert-b-dtm.mp4",
        "header": "Adding a bit",
        "text": "Place your fingers high on the spindle shaft. With your other hand start to screw on collet nut. When it is threaded but not tight inset your bit and continue to tighten until finger tight.",
        "actionText" : "Move to center",
        "action": ""
    },
    {
        "id": "9",
        "video": "images/tighten-dtm.mp4",
        "header": "Tighten collet nut",
        "text": "Fit your shaft wrench onto the shaft and fit your collet wrench onto the collet nut. Pull the shaft wrench clock-wise and pull your collet wrench counter-clock-wise until tight.",
        "actionText" : "Move to center",
        "action": ""
    },
    {
        "id": "10",
        "video": "images/install-z-dtm.mp4",
        "header": "Install Z-zero plate",
        "text": "Insert the wago connector.",
        "actionText" : "Move to center",
        "action": ""
    },
    {
        "id": "11",
        "video": "images/alligator-dtm.mp4",
        "header": "Attach alligator clip",
        "text": "Attach alligator clip to collet nut and check to make sure secure.",
        "actionText" : "Move to center",
        "action": ""
    },
    {
        "id": "12",
        "video": "images/zero-z-dtm.mp4",
        "header": "Zero Z",
        "text": "Place Z-zero plate directly beneath the bit and click 'Zero Z'. Once the routine has finished unplug the wago connector and remove plate from work area.",
        "actionText" : "Zero Z",
        "action": function() {fabmo.runSBP('C#,2')}
    },
    {
        "id": "13",
        "video": "images/rabbet-dtm.mp4",
        "header": "Check cordinates and run test file.",
        "text": "To make sure you have followed everystep correctly we are going to check your current X,Y,Z cordinates and make sure they are what we expect them to be. If they are we will go ahead and submit the job. This file is going to cut a permimeter on your cutting board to show you your exact cutting area.",
        "actionText" : "Check Cordinates",
        "action": function() {
            fabmo.requestStatus(function(err, status){
                if (err){
                    console.log(err);
                } else {
                    if (status.posx === 18 && status.posy === 12 && status.posz == 0.5) {
                        DoJobFile ();
                    } else {
                        fabmo.showModal({
                            title : 'Wrong Cordinates',
                            message : "Please re-run the tutorial to make sure you didn't skip a step.",
                            okText : 'Okay',
                            cancelText : '',
                            ok : function() { },
                            cancel : ''
                        });
                    }
                }
                
            })
        }
    }
]

function onStatus(status) {
    if(status.state == "idle" && lastStat == "running") {
        fabmo.showModal({
            title : 'Do you have a 1/4 inch bit?',
            message : 'This will determine the rest of the tutorial',
            okText : 'Yes',
            cancelText : 'No',
            ok : function() {
                content = content.concat(bitYes);
                setNext(content[counter+1], counter);
                checkCounter();
                fabmo._event_listeners.status = [];
            },
            cancel : function() {
                content = content.concat(bitNo);
                setNext(content[counter+1], counter);
                checkCounter();
                fabmo._event_listeners.status = [];
            }
        });

    } else if (status.state != lastStat) {
        lastStat = status.state;
    }

}

$( document ).ready(function() {

// fabmo.on('status', function(status){
//     if (status.state === 'running') {
//         $('.image-container').height('90%');
//         $('.content').height('0%');
//     } else  {
//      $('.image-container').height('50%');
//     $('.content').height('50%');
//     }

// });  
loadFirst(content[0]);
    if ( counter < content.length -1) {
    setNext(content[counter + 1], counter + 1);
    
    checkCounter();
    $('.tour-card').css('width', cardWidth);
    $('.tour-decloration').click(function(){
        fabmo.launchApp('home');
    });
}





});

$( window ).resize(function() {
    var currentItem;
    cardWidth = $(window).width();
    var numItems = $('.tour-card').length;
    var newContainer = numItems*cardWidth;
    $('.tour-card').css('width', cardWidth);
    
    // $('.marker').each(function(){
    //     if (isElementInViewport ($(this))) {
    //         currentItem = parseInt($(this).parent().attr('id'));
    //         console.log(currentItem);
    //     } 
        
    // });

    currentLeft = -((counter)*cardWidth);
    $('#tour-container').css({'width': newContainer,  'left': currentLeft + 'px'});
});

$('.next').click(function(){
    counter++;    
    startVideo();

    var cardNum = $('.tour-card').length;
   
    if (counter == (cardNum - 1)){
        setNext(content[counter+1], counter+1);  
    } 
    currentLeft = currentLeft - cardWidth;

    $('#tour-container').css('left', currentLeft + "px");
    checkCounter();
    $('.slide-next').show(0).delay(400).hide(0);

});

$('.prev').click(function(){
    startVideo();
    counter--;
    currentLeft = currentLeft + cardWidth;
    $('#tour-container').css('left', currentLeft + "px");
    checkCounter();
    $('.slide-next').show(0).delay(500).hide(0);
});

function loadFirst(obj){
    var set = [];
    
    var id = obj.id;
    $('.tour-card').each(function(){
        set.push($(this).attr('id'));
    });
    if (set.includes(id)){}else{
    var tourItem = document.createElement("li");
    tourItem.setAttribute("id", obj.id);
    tourItem.setAttribute("class", "tour-card");
    if (obj.action && obj.video) {
        tourItem.innerHTML = '<div class="marker"></div><div class="slide-next"></div><div class="image-container"><video loop><source src='+obj.video+' type="video/mp4"></video></div><div class="content"><h4>'+obj.header+'</h4><p>'+obj.text+'</p><div class="card-action" id='+id+'>'+obj.actionText+'</div></div>';
  
    } else {
        tourItem.innerHTML = '<div class="marker"></div><div class="slide-next"></div><div class="image-container"><img  src='+obj.image+'></div><div class="content"><h4>'+obj.header+'</h4><p>'+obj.text+'</p></div>';
    }

    
    tour.appendChild(tourItem);
    $('.tour-card').css('width', cardWidth);
}
};

function setNext(obj, counter){
    var set = [];
    if (obj){
    var id = obj.id;
    $('.tour-card').each(function(){
        set.push($(this).attr('id'));
    });

    if (set.includes(id)){}else{
    var tourItem = document.createElement("li");
    tourItem.setAttribute("id", 'card-'+obj.id);
    tourItem.setAttribute("class", "tour-card");
    if ( obj.video && obj.action) {
        tourItem.innerHTML = '<div class="marker"></div><div class="slide-next"></div><div class="image-container"><video loop><source src='+obj.video+' type="video/mp4"></video></div><div class="content"><h4>'+obj.header+'</h4><p>'+obj.text+'</p><div class="card-action" id="'+id+'">'+obj.actionText+'</div></div>';
    } else if (obj.video){
        tourItem.innerHTML = '<div class="marker"></div><div class="slide-next"></div><div class="image-container"><video loop><source src='+obj.video+' type="video/mp4"></video></div><div class="content"><h4>'+obj.header+'</h4><p>'+obj.text+'</p></div>';
    } else if (obj.image ){
        tourItem.innerHTML = '<div class="marker"></div><div class="slide-next"></div><div class="image-container"><img  src='+obj.image+'></div><div class="content"><h4>'+obj.header+'</h4><p>'+obj.text+'</p></div>';
    } else if (obj.input) {
        tourItem.innerHTML = '<div class="marker"></div><div class="slide-next"></div><div class="image-container"><input placeholder="'+obj.input+'"></div><div class="content"><h4>'+obj.header+'</h4><p>'+obj.text+'</p><div class="card-action" id="'+id+'">'+obj.actionText+'</div></div>';

    }

    
    tour.appendChild(tourItem);

    $('.tour-card').css('width', cardWidth);
    if ($('#'+obj.id).length){
        $('#'+obj.id).click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            obj.action();
        });
    }
}
}
};

function DoJobFile () {
  var sbp = "";
  var jobPath = 'jobs/Rabbet_Profile_DTMAX.sbp';
  
  jQuery.get(jobPath, function(data) {
      sbp += data;
    })
    .done(function() {
      jobPath = jobPath.replace('jobs/', '');
      jobPath = jobPath.replace('.sbp', '');
    // sbp += 'end\n';
    // sbp += "'a FabMo load\n";
      fabmo.submitJob({
        file: sbp,
        filename: 'DTMAX_Profile' + '.sbp',
        name: "test_cut",
        description: "Profile cutting area on your new Desktop Max"
      });
    })
}

function checkCounter() {
    if (counter == 0) {
        $('.prev').hide();
    } else if (counter == content.length - 1) {
         $('.next').hide();

    } else {
        $('.prev').show();
        $('.next').show();
    }
}

var visible;
function playVideo(el){
    setTimeout(function(){
       if (isElementInViewport (el)){
           el[0].play();
       } else {
           el[0].pause();
           el[0].currentTime = 0;
       }
    }, 600);
}
function startVideo () {
    $('.image-container video').each(function(){
        playVideo($(this));
    });
}


function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}