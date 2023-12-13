// listen for click on QR button
document.getElementById('generateQRButton').addEventListener('click', function() {
    // get Branch Key
    var branch_key = document.getElementById('branch_key').value;
    
    // Initialize an empty data object
    var data = {};
    var qr_code_settings = {};

    // Function to add non-empty values to the data object
    function addDataIfNotEmpty(key, value) {
        if (value.trim() !== '') {
            data[key] = value.trim();
        }
    }

     // Function to add non-empty values to the settings object
     function addSettingsIfNotEmpty(key, value) {
        if (value.trim() !== '') {
            qr_code_settings[key] = value.trim();
        }
    }

    // Handle predefined fields
    addDataIfNotEmpty('$marketing_title', document.getElementById('marketing_title').value);
    addDataIfNotEmpty('alias', document.getElementById('link_alias').value);
    addDataIfNotEmpty('~feature', document.getElementById('feature').value);
    addDataIfNotEmpty('~channel', document.getElementById('channel').value);
    addDataIfNotEmpty('~campaign', document.getElementById('campaign').value);
    addDataIfNotEmpty('$ios_url', document.getElementById('ios_url').value);
    addDataIfNotEmpty('$android_url', document.getElementById('android_url').value);
    addDataIfNotEmpty('$desktop_url', document.getElementById('desktop_url').value);
    
    // For checkbox
    data['$web_only'] = document.getElementById('web_only').checked; // Boolean
    if(document.getElementById('type').checked) {
        data['type'] = 2
    }
    
    // Handle design fields
    addSettingsIfNotEmpty('code_color', document.getElementById('code_color').value);
    addSettingsIfNotEmpty('background_color', document.getElementById('background_color').value);
    addSettingsIfNotEmpty('finder_pattern_color', document.getElementById('finder_color').value);
    addSettingsIfNotEmpty('center_logo_url', document.getElementById('center_logo').value);

    // Handle tags (split and trim each tag)
    var tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    if (tags.length > 0) {
        data['~tags'] = tags;
    }

    // Handle dynamic key-value pairs
    var linkDataPairs = document.querySelectorAll('#linkData .form-group');
    linkDataPairs.forEach(pair => {
        var key = pair.querySelector('.key-input').value.trim();
        var value = pair.querySelector('.value-input').value.trim();
        if (key !== '' && value !== '') {
            data[key] = value;
        }
    });
    
    const options = {
        method: 'POST',
        headers: {accept: 'image/*', 'content-type': 'application/json'},
        body: JSON.stringify({
            data: data,
            qr_code_settings: qr_code_settings,
            branch_key: branch_key
        })
    };
    
    fetch('https://api2.branch.io/v2/qr-code', options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            var img = document.createElement('img');
            img.src = URL.createObjectURL(blob);
            document.getElementById('qrCodeContainer').innerHTML = '';
            document.getElementById('qrCodeContainer').appendChild(img);
            
            // After the QR code is generated...
            var downloadButton = document.getElementById('downloadQRButton');
            var generateButton = document.getElementById('generateQRButton');
            
            // Move the 'Generate QR Code' button to after the 'Download QR Code' button
            downloadButton.parentNode.insertBefore(generateButton, downloadButton.nextSibling);

            // Show the download button
            document.getElementById('downloadQRButton').style.display = 'block';
        })
        .catch(err => console.error('Error:', err));
});

// listen for click on download button
document.getElementById('downloadQRButton').addEventListener('click', function() {
    var img = document.querySelector('#qrCodeContainer img');
    if (img && img.src) {
        downloadImage(img.src, 'qr-code.png');
    }
});

function downloadImage(dataUrl, filename) {
    var a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.getElementById('addLinkData').addEventListener('click', function() {
    var container = document.getElementById('linkData');
    var newPair = document.createElement('div');
    newPair.classList.add('form-group');
    newPair.innerHTML = `
        <label>Key:</label>
        <input type="text" class="form-control key-input" placeholder="Enter key">
        <label>Value:</label>
        <input type="text" class="form-control value-input" placeholder="Enter value">
    `;
    container.appendChild(newPair);
});
