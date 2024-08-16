$(document).ready(function() {
    function renderIcon() {
        var iconClass = $('#icon').val();
        var styleClass = $('#style').val();
        var size = $('#size').val();
        var color = $('#color').val();

        // Render the icon as an <i> element with the correct class format
        $('#render').html('<i class="' + styleClass + ' ' + iconClass + '" style="width:' + size + 'px;"></i>');

        // Add a brief timeout to allow FontAwesome to convert the <i> to <svg>
        setTimeout(function() {
            // Apply the fill color to the <path> inside the converted <svg>
            $('#render svg path').attr('fill', color);
        }, 100); // 100ms delay should be sufficient
    }

    // Initial render
    renderIcon();

    // Re-render the icon when the icon class or style changes
    $('#icon, #style').on('input change', function() {
        renderIcon();
    });

    // Update the size of the SVG directly without re-rendering
    $('#size').on('input', function() {
        $('#render svg').css('width', $(this).val() + 'px');
    });

    // Update the fill color of the <path> inside the <svg> without re-rendering
    $('#color').on('input', function() {
        $('#render svg path').attr('fill', $(this).val());
    });

    // Handle SVG download
    $('.toolbar__button--svg').on('click', function() {
        var iconClass = $('#icon').val(); // Get the icon class for the file name
        var svgElement = $('#render').html(); // Get the SVG content
        var svgBlob = new Blob([svgElement], { type: 'image/svg+xml;charset=utf-8' });
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = iconClass + ".svg"; // Set the file name based on the icon class
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });

    // Handle PNG download
    $('.toolbar__button--png').on('click', function() {
        var iconClass = $('#icon').val(); // Get the icon class for the file name
        var svgElement = $('#render').html(); // Get the SVG content
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        var svg = new Blob([svgElement], { type: 'image/svg+xml;charset=utf-8' });
        var DOMURL = self.URL || self.webkitURL || self;
        var url = DOMURL.createObjectURL(svg);
        var img = new Image();

        img.onload = function() {
            // Set canvas dimensions to the SVG size
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            DOMURL.revokeObjectURL(url);

            // Create a PNG from the canvas
            var imgURI = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

            // Trigger download
            var pngLink = document.createElement("a");
            pngLink.href = imgURI;
            pngLink.download = iconClass + ".png"; // Set the file name based on the icon class
            document.body.appendChild(pngLink);
            pngLink.click();
            document.body.removeChild(pngLink);
        };

        img.src = url;
    });
});