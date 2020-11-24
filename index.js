/* Create one Fake input file */
var fakeInput = document.createElement("input");
fakeInput.type = "file";
fakeInput.accept = "image/*";
fakeInput.multiple = true;
// var formData = new FormData();
var formData = new Map();

var dropRegion = document.getElementById("drop-region");

var imagePreviewRegion = document.getElementById("image-preview");

/* Detect Onclick into region */
$("#drop-region").click(function (e) {
  e.preventDefault();
  fakeInput.click();
});

/* Detect onclick */
fakeInput.addEventListener("change", function () {
  var files = fakeInput.files;
  console.log("fakeInput.addEventListener -> files", files);
  handleFiles(files);
});

const preventDefault = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

dropRegion.addEventListener("dragenter", preventDefault, false);
dropRegion.addEventListener("dragleave", preventDefault, false);
dropRegion.addEventListener("dragover", preventDefault, false);
dropRegion.addEventListener("drop", preventDefault, false);

/**
 * handle the drop event of a image
 * @param {Event} e : event drop
 * @return {Void}
 */
function handleDrop(e) {
  var dt = e.dataTransfer,
    files = dt.files;

  if (files.length) {
    handleFiles(files);
  } else {
    // check for img
    var html = dt.getData("text/html"),
      match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html),
      url = match && match[1];
    console.log("handleDrop -> url", url);
    console.log("handleDrop -> match", match);
    console.log("handleDrop -> html", html);
    if (url) {
      // uploadImageFromURL( url );
      return;
    }
  }
}

dropRegion.addEventListener("drop", handleDrop, false);

/**
 * Shows the images in a area
 * @param {File} files : image in a format
 * @return {Void}
 */
function handleFiles(files) {
  for (let i = 0, len = files.length; i < len; i++) {
    if (validateImage(files[i])) previewAndUploadImage(files[i]);
  }
}

/**
 * Validates the format of a Image
 * @param {File} image : image to validate
 * @return {Boolean} : if the image isa validate
 */
function validateImage(image) {
  // check the type
  var validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (validTypes.indexOf(image.type) === -1) {
    alert(
      "El archivo no es un tipo válido, recuerde que los tipos válidos son JPG o PNG "
    );
    return false;
  }

  // check the size
  var maxSizeInBytes = 10e6; // 10MB
  if (image.size > maxSizeInBytes) {
    alert("File too large");
    return false;
  }

  return true;
}

/**
 * Preview images in an area and upload
 * @param {File} image : the image to preview and upload
 * @return {Void}
 */
function previewAndUploadImage(image) {
  // container
  var imgView = document.createElement("div");
  imgView.className = "image-view";
  imagePreviewRegion.appendChild(imgView);

  //image and text container
  var imgText = document.createElement("div");
  imgText.className = "image-text-container";
  imgView.appendChild(imgText);

  // previewing image
  var img = document.createElement("img");
  imgText.appendChild(img);

  // text preview image
  var textImage = document.createElement("span");
  var text = document.createTextNode(image.name);
  textImage.appendChild(text);
  imgText.appendChild(textImage);

  //create the remove button
  var removeButton = document.createElement("button");
  removeButton.className = "xButton";
  imgView.appendChild(removeButton);
  removeButton.onclick = () => {
    imagePreviewRegion.removeChild(imgView);
    formData.delete(image.name);
  };

  //Add the svg to button
  var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  // read the image...
  var reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result;
  };
  reader.readAsDataURL(image);

  // create FormData
  //   var formData = new FormData();
  formData.set(image.name, image);

  console.log(formData);

  document.getElementById("images").name = formData.get(image.name);
  console.log(document.getElementById("images").name);
  //Se da el valor al input
  //   document.getElementById("images").name = formData.getAll("image");
  //   console.log(formData);
}
