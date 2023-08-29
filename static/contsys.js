// Sort the rows in first <tbody> of the specified table according to 
// the value of nth cell within each row. Use the comparator function 
// if one is specified. Otherwise, compare the values alphabetically.
function sortrows(table, n, comparator) {
  var tbody = table.tBodies[0]; // First <tbody>; may be implicitly created
  var rows = tbody.getElementsByTagName("tr"); // All rows in the tbody
  rows = Array.prototype.slice.call(rows,0); // Snapshot in a true array
  
  // Now sort the rows based on the text in the nth <td> element 
  rows.sort(function(row1,row2) {
    var cell1 = row1.getElementsByTagName("td")[n];  // Get nth cell
    var cell2 = row2.getElementsByTagName("td")[n];  // of both rows
    var val1 = cell1.textContent || cell1.innerText; // Get text content
    var val2 = cell2.textContent || cell2.innerText; // of the two cell
    if (comparator) return comparator(val1, val2);   // Compare them!
    if (val1 < val2) return -1;
    else if (val1 > val2) return 1;
    else return 0;
  });
  
  // Now append the rows into the tbody in their sorted order.
  // This automatically moves them from their current location, so there
  // is no need to remove them first. If the <tbody> contains any
  // nodes other than <tr> elements, those nodes will float to the top.
  for(var i = 0; i < rows.length; i++) tbody.appendChild(rows[i]);
}

// Find the <th> elements of the table (assuming there is only one row of them)
// and make them clickable so that clicking on a column header sorts
// by that column.
function makeSortable(table) {
  var headers = table.getElementsByTagName("th");
  for(var i = 0; i < headers.length; i++) {
    (function(n) { // Nested funtion to create a local scope 
       headers[i].onclick = function() { sortrows(table, n); }; 
    }(i)); // Assign value of i to the local variable n
  } 
}

window.addEventListener("load", (event) => {
  var table = document.getElementsByTagName("table")[0];
  makeSortable(table);
  makeCellsEditable(table);
  table.addEventListener("edit-element-left", (event) => {
    console.log(event);
    event.srcElement.value = event.detail.text;
    makeCellsUneditable(table);
  });
  table.addEventListener("edit-element-right", (event) => {
    
  });
});


// double clickable table data
function makeCellsEditable(table) {
  // make each table cell (e.g. td-element) contentEditable
  // by double clicking it
  var cells = table.getElementsByTagName("td");
  for(var i = 0; i < cells.length; i++) {
    cells[i].addEventListener('dblclick', (event) => {
      event.preventDefault();
      
      // toggle editability of the cell
      if (event.target.classList.contains("editable")) {
        /* event.target.innerText = event.target.getElementsByTagName("edit-element")[0].value; */
        event.target.classList.remove("editable");
        event.target.blur();
      } else {
        makeCellsUneditable(table);
        /* event.target.contentEditable = "true"; */
        let editbox = document.createElement("edit-element");
        editbox.value = event.target.innerText;
        event.target.innerText = "";
        event.target.classList.add("editable");
        event.target.append(editbox);
        /* event.target.focus(); */
        /* event.target.setSelectionRange(0,event.target.innerText.length); */
      }
    })
  }
}

function makeCellsUneditable(table) {
  var editors = table.getElementsByTagName("edit-element");
  for(var i = 0; i < editors.length; i++) {
    /* var oldText = editors[i].value; */
    editors[i].parentNode.innerText = editors[i].value;
    editors[i].parentNode.classList.remove("editable");
  }
}