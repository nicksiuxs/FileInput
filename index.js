/* Create one Fake input file */
let fakeInput = document.getElementById("images");
fakeInput.type = "file";
fakeInput.accept = "image/*";
fakeInput.multiple = true;

var formData = new Map();
let previous_files;

let dropRegion = document.getElementById("drop-region");

let imagePreviewRegion = document.getElementById("image-preview");

let indexImage = 0;

let indexInput = 0;

/* Detect Onclick into region */
$("#drop-region").click(function (e) {
  e.preventDefault();
  //   previous_files = $("#images").prop("files");
  fakeInput.click();
});

/* Detect onclick */
fakeInput.addEventListener("change", function () {
  let files = fakeInput.files;
  // console.log("fakeInput.addEventListener -> files", files);
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
  let dt = e.dataTransfer,
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
 * Shows the images in a area and upload
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
 * @return {Boolean} : if the image is validate
 */
function validateImage(image) {
  // check the type
  let validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (validTypes.indexOf(image.type) === -1) {
    alert(
      "El archivo no es un tipo válido, recuerde que los tipos válidos son JPG o PNG "
    );
    return false;
  }

  // check the size
  let maxSizeInBytes = 10e6; // 10MB
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
  let imgView = document.createElement("div");
  imgView.className = "image-view";
  imagePreviewRegion.appendChild(imgView);

  //create de input file
  let newInput = document.createElement("input");
  newInput.className = "fake-input";
  newInput.id = "fake-input-" + indexInput;
  newInput.style = "display:none;";
  imgView.appendChild(newInput);

  //image and text container
  let imgText = document.createElement("div");
  imgText.className = "image-text-container";
  imgView.appendChild(imgText);

  // previewing image
  let img = document.createElement("img");
  img.className = "foto-producto";
  imgText.appendChild(img);

  // text preview image
  let textImage = document.createElement("span");
  let text = document.createTextNode(image.name);
  textImage.appendChild(text);
  imgText.appendChild(textImage);

  //create the remove button
  let removeButton = document.createElement("button");
  removeButton.className = "xButton";
  imgView.appendChild(removeButton);

  //Delete the image
  removeButton.onclick = () => {
    imagePreviewRegion.removeChild(imgView);
  };

  //svg
  let svg = document.createElement("img");
  svg.className = "icon";
  svg.src = "close.svg";
  removeButton.appendChild(svg);

  let element = document.getElementById("fake-input-" + indexInput);
  console.log(element);

  // read the image...
  let reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result;
  };
  reader.readAsDataURL(image);

  // formData.set(indexImage, image);
  formData.set(image.name, indexImage);

  //agregar
  duplicateValueInput(element.id, "images");

  console.log("------------------------------------------------\n");
}

/**
 * Allows duplicate the value of a input file in other
 * @param {String} idDuplicateInput : id of the new input
 * @param {String} idInput : id of the input to duplicate
 * @return {Void}
 */
function duplicateValueInput(idDuplicateInput, idInput) {
  $("#" + idDuplicateInput).prop("files", $("#" + idInput).prop("files"));
  console.log("Duplicado", $("#" + idDuplicateInput).prop("files"));
}

// /**
//  * Allows to clear the value of a input
//  * @param {String} idToClear : id of the input file to clear
//  * @return {Void}
//  */
// function clearInput(idToClear) {
//   let inputTmp = document.getElementById("input-empty");
//   console.log("antes de borrado", $("#input-fake-1").prop("files"));
//   duplicateValueInput(idToClear, inputTmp.id);
// }
