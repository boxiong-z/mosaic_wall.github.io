
document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('uploadForm');
    const mosaicWall = document.getElementById('mosaicWall');
    const previewModal = document.getElementById('previewModal');
    const previewImage = document.getElementById('previewImage');
    const description = document.getElementById('description');
    const closeModal = document.getElementsByClassName('close')[0];
    let currentPhotoIndex = 0;
    let photos = [];

    // Fetch and display photos on load
    fetchPhotos();

    // Handle photo upload
    uploadForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(uploadForm);
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchPhotos(); // Refresh the photo wall
                uploadForm.reset(); // Reset the form
            } else {
                alert('Error uploading photo.');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Function to fetch and display photos
    function fetchPhotos() {
        fetch('/photos')
        .then(response => response.json())
        .then(fetchedPhotos => {
            photos = fetchedPhotos;
            updateMosaicWall();
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to update the mosaic wall
    function updateMosaicWall() {
        mosaicWall.innerHTML = ''; // Clear the wall
        if (photos.length > 0) {
            const photo = photos[currentPhotoIndex % photos.length];
            const img = document.createElement('img');
            img.src = photo.url;
            img.alt = photo.description;
            img.onclick = () => showPreview(photo.url, photo.description);
            mosaicWall.appendChild(img);
            currentPhotoIndex++;
        }
    }

    // Rotate photos every 5 seconds
    setInterval(updateMosaicWall, 5000);

    // Show preview modal
    function showPreview(url, desc) {
        previewImage.src = url;
        description.textContent = desc;
        previewModal.style.display = 'block';
    }

    // Close modal
    closeModal.onclick = function() {
        previewModal.style.display = 'none';
    }

    // Close modal when clicking outside of the image
    window.onclick = function(event) {
        if (event.target === previewModal) {
            previewModal.style.display = 'none';
        }
    }
});
