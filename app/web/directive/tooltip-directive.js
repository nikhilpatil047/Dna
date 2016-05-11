//Define tooltip Directive
app.directive('tooltip',  
    function() {
        return {
            restrict: 'A',
            link: function() {
                var tooltipSpan,
                    x,
                    y;
               //Find the element which will contain tooltip
                tooltipSpan = document.getElementById('tooltip-span');
                
                //Bind mousemove event to the element which will show tooltip
                $("#tooltip").mousemove(function(e) {
                    //find X & Y coodrinates
                    x = e.clientX,
                    y = e.clientY;
                    
                    //Set tooltip position according to mouse position
                    tooltipSpan.style.top = (y + 20) + 'px';
                    tooltipSpan.style.left = (x + 20) + 'px';
                });
                   
            }
            };
    });