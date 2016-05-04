$(document).ready(function () {

    PNotify.prototype.options.styling = "bootstrap3";
    PNotify.prototype.options.delay = 5000;
    PNotify.prototype.options.width = "350px";
    function mymessage(mytype, mytitle, mytext) {
        new PNotify({
            type: mytype,
            title: mytitle,
            text: mytext,
            styling: 'bootstrap3'
        });
    }

    $(document).on("click", ".notify-zone", function () {
       console.log("notify-zone");
       var zone = $(this).data('id');
       $.ajax({
              'url' : '/servers/'+$(this).data('server')+'/domains/notify/'+zone,
              'type' : 'GET',
              'cache' : false,
              'dataType' : 'json',
              'success' : function(data) {
                      if(data.result) {
                        mymessage("success", "Notify Zone", data.result +" for "+ zone);
                      }
                      if(data.error) {
                        mymessage("error", "Notify Zone", data.error);
                      }
              }
       });
    });

    $(document).on("click", ".retrieve-zone", function () {
       console.log("retrieve-zone");
       var zone = $(this).data('id');
       $.ajax({
              'url' : '/servers/'+$(this).data('server')+'/domains/retrieve/'+zone,
              'type' : 'GET',
              'cache' : false,
              'dataType' : 'json',
              'success' : function(data) {
                      console.log(data);
                      if(data.result) {
                        mymessage("success", "axfr-retrieve zone", data.result + " for "+ zone);
                      }
                      if(data.error) {
                        mymessage("error", "axfr-retrieve zone", data.error);
                      }
              }
       });
    });

    // Init bootstrap form validation plugin
    $('#form-add-domain')
      .formValidation({
         framework: 'bootstrap',
         excluded: [':disabled', ':hidden', ':not(:visible)'],
         icon: {
              valid: 'glyphicon glyphicon-ok',
              invalid: 'glyphicon glyphicon-remove',
              validating: 'glyphicon glyphicon-refresh'
         },
         fields: {
            name: {
                message: 'The domain name is not valid',
                validators: {
                    notEmpty: {
                        message: 'The domain name is required'
                    },
                    regexp: {
                        enabled: true,
                        regexp: /^[a-z0-9_\.-]+$/,
                        message: 'The domain name can only consist of alphabetical, numbers, underscore, dash, dot'
                    }
                }
            },
            master: {
                message: 'The master list is not valid',
                validators: {
                    regexp: {
                        enabled: true,
                        regexp: /^[0-9\.,:]+$/,
                        message: 'The master list must be a list of IPv4 or Ipv6 separate by a comma'
                    },
                }
            },
         }
    })
    .on('error.field.bv', function (e, data) {
        console.log(data.field, data.element, '-->error');
    })
    .on('success.field.bv', function (e, data) {
        //console.log(data.field, data.element, '-->success');
    });

    // Reset all given fields. It hides the error messages and feedback icons.
    $('#add-domain-modal').on('hidden.bs.modal', function() {
      //console.log(".on hidden.bs.modal");
      // Not working as expected
      $('#form-add-domain').formValidation('resetForm', true);
      // So let's do it manually, foreach input group
      $('.form-group').each(function(i, obj) {
         $(this).removeClass('has-error has-success');
      });
      // foreach icon result
      $('.form-control-feedback').each(function(i, obj) {
         $(this).css("display" ,"none");
         $(this).removeClass('glyphicon glyphicon-remove glyphicon-ok');
      });
    });

    $('#domains-table').dataTable();
    $(document).on("click", ".add-domain", function () {
        $('#form-add-domain').formValidation('resetForm', true);
        $('#mod-edit-operation').html("Add domain");
        $('#mod-edit-name').val("");
        $('#mod-edit-type-master').prop('checked', true);
        $('#mod-edit-master-box').attr("class", "hide");
        $('#mod-edit-master').val("");
        $('#mod-edit-submit').html("Add");
        $('#mod-edit-submit').attr("href", "/servers/#{serverselected.id}/domains/add");
        $('#add-domain-modal').modal('show');
    });
    $(document).on("click", ".edit-domain", function () {
        var DomainId = $(this).data('id'),
            DomainName = $(this).data('name'),
            DomainKind = $(this).data('kind').toLowerCase(),
            DomainKindId = "#mod-edit-type-"+DomainKind,
            DomainMasters = $(this).data('masters');
        $('#form-add-domain').formValidation('resetForm', true);
        $('#mod-edit-operation').html("Edit "+DomainName);
        $('#mod-edit-name').val( DomainName );
        $(DomainKindId).prop('checked', true );
        if (DomainKind == 'native') {
            $('#mod-edit-master-box').attr("class", "");
            $('#mod-edit-master').val( DomainMasters );
        } else {
            $('#mod-edit-master-box').attr("class", "hide");
            $('#mod-edit-master').val("");
        }
        $('#mod-edit-submit').html("Update");
        $('#mod-edit-submit').attr("href", "/servers/#{serverselected.id}/domains/edit/"+DomainId);
        $('#add-domain-modal').modal('show');
    });
    $(document).on("click", ".del-domain", function () {
        var DomainId = $(this).data('id');
        var DomainName = $(this).data('name');
        $('#mod-delete-operation').html("Delete "+DomainName);
        $('#mod-delete-text-name').html(DomainName);
        $('#mod-delete-submit').html("Delete");
        $('#mod-delete-submit').attr("href", "/servers/#{serverselected.id}/domains/del/"+DomainId);
        $('#del-domain-modal').modal('show');
    });
    // On update radio type
    $('input[type=radio][name=type]').change(function() {
        if (this.value == 'NATIVE') {
            $('#mod-edit-master-box').attr("class", "");
        } else {
            $('#mod-edit-master-box').attr("class", "hide");
        }
    });
});
