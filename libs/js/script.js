// assign event listeners


$('#editAlbumForm').on('submit', function (e) {
  e.preventDefault();
  editAlbums();
});

$('#newAlbumForm').on('submit', function (e) {
  e.preventDefault();
  newAlbum();
});

$('#deleteAlbumForm').on('submit', function (e) {
  e.preventDefault();
  deleteAlbum();
});



$('#addBtn').click(function () {
  window.alert("bollocks");
  
  $('#newAlbumModal').modal('show');


});

//Get all grid data


function getAllData() { 
    $.ajax({
      url: './libs/php/getAll.php',
      type: 'POST',
      dataType: 'json',
  
      success: function (result) {
        createAlbumTable(result.data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#editPersonnelModal .modal-title').replaceWith(
          'Error retrieving data'
        );
      },
    });
  }






function createAlbumTable(data) {
  
  
    $('#albumTableBody tr').remove();
  
   let value;
  
    var rows = "";
  
    data.forEach(function(item, index) {
  let id=item.albumID;
      value="<td class='text-end text-nowrap'>" +
      "<button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal'" +
      "data-bs-target='#editAlbumModal' data-id=" +
      id +
      '>' +
      "<i class='fa-solid fa-pencil fa-fw'></i>" +
      '</button>' +
      "<button type='button' class='btn btn-primary btn-sm deletealbumBtn ms-1' data-bs-toggle='modal'" +
      "data-bs-target='#deleteAlbumModal' data-id=" +
      id +
      '>' +
      "<i class='fa-solid fa-trash fa-fw'></i></button></td></tr>";
      
      rows += `<tr><td class='align-middle text-nowrap'>${item.albumName}</td><td class='align-middle text-nowrap d-none d-md-table-cell'>${item.artistName}</td> <td class='align-middle text-nowrap d-none d-md-table-cell'>${item.year_release}</td><td class= 'align-middle text-nowrap d-none d-md-table-cell'>${item.ranking}</td>`+value;  
      
    });
    
    $('#albumTableBody').append(rows);
  
  }
  getAllData();


  $('#editAlbumModal').on('show.bs.modal', function (e) {
    $.ajax({
      url: './libs/php/getAlbumsByID.php',
      type: 'POST',
      dataType: 'json',
      data: {
        albumID: $(e.relatedTarget).attr('data-id'), 
      },
      success: function (result) {
       
        var resultCode = result.status.code;
      
        if (resultCode == 200) {
         
  
          $('#editAlbumID').val(result.data[0].albumID);
  
          $('#editAlbumName').val(result.data[0].albumName);
          $('#editArtistName').val(result.data[0].artistName);
          $('#editReleaseYear').val(result.data[0].year_release);
  
          $('#editRanking').val(
            result.data[0].ranking
          );
         
         
         
         
        } else {
          $('#editAlbumModal .modal-title').replaceWith(
            'Error retrieving data'
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#editAlbumModal .modal-title').replaceWith(
          'Error retrieving data'
        );
      },
    });
  });


  function editAlbums() {
    $.ajax({
      url: './libs/php/editAlbums.php',
      type: 'POST',
      dataType: 'json',
      data: {
        albumName: $('#editAlbumName').val(),
        artistName: $('#editArtistName').val(),
        releaseYear: $('#editReleaseYear').val(),
        
        ranking: $('#editRanking').val(),
        albumID: $('#editAlbumID').val(),
      },
      success: function (result) {
        $('#editAlbumStatus').html(result.data);
        $('#editAlbumStatus').addClass('databaseStatus');
       
       
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#editAlbumModal .modal-title').replaceWith('Error retrieving data');
      },
    });
    setTimeout(function() {$('#editAlbumModal').modal('hide');}, 3000);
  }


  //insert an album

  function newAlbum() {
    $.ajax({
      url: './libs/php/addAlbum.php',
      type: 'POST',
      dataType: 'json',
      data: {
        albumName: $('#newAlbumName').val(),
        artistName: $('#newArtistName').val(),
        ranking: $('#newRanking').val(),
        year_release: $('#newReleaseYear').val(),
        
      },
      success: function (result) {
        
        $('#newAlbumStatus').html(result.data);
        $('#newAlbumStatus').addClass('databaseStatus');
        setTimeout(function() {$('#newAlbumModal').modal('hide');}, 3000);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#newAlbumModal .modal-title').replaceWith('Error retrieving data');
      },
    });
  }


  //delete an album

  function deleteAlbum() {
    $.ajax({
      url: './libs/php/deleteAlbum.php',
      type: 'POST',
      dataType: 'json',
      data: {
        albumID: $('#deleteAlbumID').val(),
        albumName:  $('#deleteAlbumName').val(),
      },
      success: function (result) {
        $('#deleteAlbumStatus').html(result.status);
        $('#deleteAlbumStatus').addClass('databaseStatus');
  
        setTimeout(function() {$('#deleteAlbumModal').modal('hide');}, 3000);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#deleteAlbumModal .modal-title').replaceWith('Error retrieving data');
      },
    });
  }
  

  //fill in delete modal

  $('#deleteAlbumModal').on('show.bs.modal', function (e) {
    let id = $(e.relatedTarget).attr('data-id');
    $('#deleteAlbumID').val(id);
   
    $('#deleteAlbumStatus').html('');
  
  
  let deleteText;
  
    let albumID = $('#deleteAlbumID').val();
  
    $.ajax({
      url: './libs/php/getAlbumsByID.php',
      type: 'POST',
      dataType: 'json',
      data: {
        albumID: albumID,
      },
  
      success: function (result) {
        console.log(result.data[0].albumName);
        var resultCode = result.status.code;   
        if (resultCode == 200) {
          $('#deleteAlbumName').val(result.data[0].albumName);      
          // let saveButton = document.getElementById('btnDeleteAlbum');    
          // let closeButton = document.getElementById('btnCloseDeleteAlbum');  
              
          
            deleteText="You are about to permanently delete <b>"+ result.data[0].albumName +"</b> from the system. Are you sure you want to proceed?"
            //saveButton.hidden = false;
           // closeButton.innerText="NO";
          
          $('#delAlbumText').html(deleteText);
          
        } 
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#deleteAlbumModal .modal-title').replaceWith('Error retrieving data');
      },
    });
  
  });
  