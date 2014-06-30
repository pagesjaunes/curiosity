Curiosity.directive('resizer', function($document) {
    return function($scope, $element, $attrs) {
        $element.on('mousedown', function(event) {
            event.preventDefault();
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });
        function mousemove(event) {
            if ($attrs.resizer == 'vertical') {
                // Handle vertical resizer
                var x = event.pageX;
                $($attrs.resizerLeft).css({
                    width: x + 'px'
                });
                $($attrs.resizerRight).css({
                    width: (window.innerWidth - (x + parseInt($attrs.resizerWidth)) - 30) + 'px'
                });
            } else {
                // Handle horizontal resizer
                var y = window.innerHeight - event.pageY;
                $element.css({
                    bottom: y + 'px'
                });
                $($attrs.resizerTop).css({
                    bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
                });
                $($attrs.resizerBottom).css({
                    height: y + 'px'
                });
            }
        }
        function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
        }
    };
}); 