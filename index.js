/* Create one Fake input file */
let fakeInput = document.getElementById("images");
fakeInput.type = "file";
fakeInput.accept = "image/*";
fakeInput.multiple = true;

let dropRegion = document.getElementById("drop-region");

let imagePreviewRegion = document.getElementById("image-preview");

let indexInput = 1;

let title = document.getElementById("title-files");

/* Detect Onclick into region */
$("#drop-region").click(function (e) {
  e.preventDefault();
  fakeInput.click();
});

/* Detect onclick */
fakeInput.addEventListener("change", function () {
  let files = fakeInput.files;
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

  //gives values to the input images of the fake input
  $("#images").prop("files", files);

  if (files.length) {
    handleFiles(files);
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
    alert("El archivo supera el límite de 10MB");
    return false;
  }

  return true;
}

$("#image-preview").attr("style", "background:none");

/**
 * Preview images in an area and upload to a input
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
  newInput.type = "file";
  newInput.multiple = true;
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
    $("#image-preview").empty();
    title.style = "display:none";
    $("#image-preview").attr("style", "background:none");
    indexInput--;
  };

  //icon x of the each image
  let svg = document.createElement("img");
  svg.className = "icon";
  svg.src = "close.svg";
  removeButton.appendChild(svg);

  // read the image...
  let reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result;
  };
  reader.readAsDataURL(image);

  let element = document.getElementById("fake-input-" + indexInput);

  //Add the images
  if (document.getElementsByClassName("image-view").length < 4) {
    $("#image-preview").attr("style", "background:#ededed");
    title.style = "display: block";
    if (document.getElementsByClassName("image-view").length > 1) {
      removeButton.style = "display:none";
    }
    duplicateValueInput(element.id, "images");

    // let idInput = document.getElementsByClassName("image-view").length;

    indexInput++;
    rewriteId();
    clearInput("images");
  } else if (document.getElementsByClassName("image-view").length > 3) {
    imagePreviewRegion.removeChild(imgView);
    alert("No se pueden cargar más de 3 imágenes");
  }

  console.log("------------------------------------------------\n");
}

/**
 * Allows duplicate the value of a input file in other
 * @param {String} idDuplicateInput : id of the new input
 * @param {String} idInput : id of the input to duplicate
 * @return {Void}
 */
function duplicateValueInput(idDuplicateInput, idInput) {
  // console.log("input id", $("#" + idInput).prop("files"));
  $("#" + idDuplicateInput).prop("files", $("#" + idInput).prop("files"));
  // console.log("Id duplicado", idDuplicateInput);
  // console.log("Duplicado", $("#" + idDuplicateInput).prop("files"));
}

/**
 * Allows to clear the value of a input
 * @param {String} idToClear : id of the input file to clear
 * @return {Void}
 */
function clearInput(idToClear) {
  let inputTmp = document.getElementById("input-empty");
  // console.log("antes de borrado", $("#" + idToClear).prop("files"));
  duplicateValueInput(idToClear, inputTmp.id);
}

/**
 * Allows to rewrite and sort the id of the inputs
 * @return {Void}
 */
function rewriteId() {
  console.log("Entreee");
  let count = 1;
  $("#image-preview")
    .children()
    .each(function () {
      $(this)
        .children()
        .first()
        .attr("id", "fake-input-" + count);
      count++;
    });
}
