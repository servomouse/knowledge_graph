let jsonFileContent = '';

function uploadEncryptedFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (event) => {
        const file = event.target.files[0];
        const password = prompt('Enter password to decrypt the file:');
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const decrypted = CryptoJS.AES.decrypt(e.target.result, password).toString(CryptoJS.enc.Utf8);
                jsonFileContent = JSON.parse(decrypted);
                console.log('Decrypted JSON:', jsonFileContent);
            } catch (error) {
                alert('Invalid password or corrupted file.');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function uploadNonEncryptedFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            // try {
                jsonFileContent = JSON.parse(e.target.result);
                console.log('Uploaded JSON:', jsonFileContent);
                set_graph(jsonFileContent);
                for (const nodeId in graph) {
                    const node = graph[nodeId];
                    node.tags.forEach(nodeTag => {
                        if(!searchSuggestions.includes(nodeTag)) {
                            searchSuggestions.push(nodeTag);
                        }
                    });
                }
                drawGraph();
            // } catch (error) {
            //     alert('Invalid JSON file.');
            // }
        };
        reader.readAsText(file);
    };
    input.click();
}

function saveFile() {
    const password = prompt('Enter password to encrypt the file:');
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(jsonFileContent), password).toString();
    const blob = new Blob([encrypted], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'encrypted.json';
    link.click();
}

function saveFileUnencrypted() {
    const blob = new Blob([JSON.stringify(jsonFileContent, null, 4)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'unencrypted.json';
    link.click();
}

function uploadEncryptedFileFromURL() {
    const url = prompt('Enter the URL of the encrypted JSON file:');
    const password = prompt('Enter password to decrypt the file:');
    fetch(url)
    .then(response => response.text())
    .then(data => {
        try {
            const decrypted = CryptoJS.AES.decrypt(data, password).toString(CryptoJS.enc.Utf8);
            jsonFileContent = JSON.parse(decrypted);
            console.log('Decrypted JSON from URL:', jsonFileContent);
        } catch (error) {
            alert('Invalid password or corrupted file.');
        }
    })
    .catch(error => {
        alert('Failed to fetch the file from the URL.');
        console.error('Error:', error);
    });
}