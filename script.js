$(document).ready(function() {
    function renderIcon() {
        const icon = $('#icon').val();
        const style = $('#style').val();
        
        const iconHtml = `<i class="${style} ${icon}"></i>`;
        $('.render').html(iconHtml);

        setTimeout(updateAttributes, 500);
    }

    function updateAttributes() {
        const svg = $('.render svg').first();
        const size = $('#size').val();
        const color = $('#color').val();
        const customColor = $('#custom-color').val();
        const shape = $('#shape').val();
        const borderRadius = $('#border-radius').val();
    
        const activeColor = color === 'custom' ? customColor : color;
    
        while (svg[0].attributes.length > 0) {
            svg.removeAttr(svg[0].attributes[0].name);
        }
    
        svg.attr({
            'xmlns': 'http://www.w3.org/2000/svg',
            'viewBox': `0 0 ${size} ${size}`,
            'width': size,
            'height': size,
            'preserveAspectRatio': 'xMidYMid meet'
        });
    
        // Clear any existing shape
        svg.find('rect, circle').remove();
    
        let scaleFactor = 1.0; // Default scale factor
    
        if (shape !== 'none') {
            let shapeElement;
            const namespace = 'http://www.w3.org/2000/svg';
    
            scaleFactor = 0.75; // Apply 75% scale if a shape is selected
    
            if (shape === 'square') {
                shapeElement = document.createElementNS(namespace, 'rect');
                $(shapeElement).attr({
                    'width': size,
                    'height': size,
                    'rx': borderRadius,
                    'ry': borderRadius,
                    'fill': activeColor
                });
            } else {
                shapeElement = document.createElementNS(namespace, 'circle');
                const radius = size / 2;
                $(shapeElement).attr({
                    'cx': radius,
                    'cy': radius,
                    'r': radius,
                    'fill': activeColor
                });
            }
    
            svg.prepend(shapeElement);
            svg.find('path').attr('fill', '#ffffff');
        } else {
            svg.find('path').attr('fill', activeColor);
        }
    
        // Apply scaling and centering to the first path element
        const path = svg.find('path').first();
        if (path.length) {
            const bbox = path[0].getBBox();
            const scale = Math.min(size / bbox.width, size / bbox.height) * scaleFactor;
            const translateX = (size - bbox.width * scale) / 2 - bbox.x * scale;
            const translateY = (size - bbox.height * scale) / 2 - bbox.y * scale;
    
            path.attr('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
        }
    }

    function toggleInputs() {
        const color = $('#color').val();
        const shape = $('#shape').val();

        if (color !== 'custom') {
            $('#custom-color').hide();
        } else {
            $('#custom-color').show();
        }

        if (shape !== 'square') {
            $('#border-radius, #border-radius-label').hide();
        } else {
            $('#border-radius, #border-radius-label').show();
        }
    }

    function handleDragInput(labelSelector, inputSelector) {
        let isDragging = false;
        let startX = 0;
        let startValue = 0;

        $(labelSelector).on('mousedown', function(e) {
            isDragging = true;
            startX = e.pageX;
            startValue = parseInt($(inputSelector).val(), 10);
            e.preventDefault();
        });

        $(document).on('mousemove', function(e) {
            if (isDragging) {
                const offset = e.pageX - startX;
                const newValue = startValue + Math.floor(offset / 4);
                $(inputSelector).val(newValue).trigger('change');
            }
        });

        $(document).on('mouseup', function() {
            if (isDragging) {
                isDragging = false;
            }
        });
    }

    function downloadSVG() {
        const svgData = new XMLSerializer().serializeToString($('.render svg')[0]);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = 'icon.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    function downloadPNG() {
        const svgElement = $('.render svg')[0];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = parseInt($('#size').val(), 10);

        // Set canvas dimensions
        canvas.width = size;
        canvas.height = size;

        // Create an image object
        const img = new Image();
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = function() {
            ctx.drawImage(img, 0, 0, size, size);
            URL.revokeObjectURL(url);

            const imgURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const downloadLink = document.createElement('a');
            downloadLink.href = imgURI;
            downloadLink.download = 'icon.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };

        img.src = url;
    }

    $('#icon, #style').on('change', renderIcon);
    $('#size, #color, #custom-color, #shape, #border-radius').on('change', function() {
        updateAttributes();
        toggleInputs();
    });

    $('.toolbar__button--download').first().on('click', function() {
        downloadSVG();
    });

    $('.toolbar__button--download').last().on('click', function() {
        downloadPNG();
    });

    handleDragInput('#size-label', '#size');
    handleDragInput('#border-radius-label', '#border-radius');

    toggleInputs();
    renderIcon();
});