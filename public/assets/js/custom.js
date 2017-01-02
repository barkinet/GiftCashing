/**
 * Created by joseph on 12/11/16.
 */
$( document ).ready(function() {
    // close alert row
    window.setTimeout(function() {
        $('.alert').fadeTo(500, 0).slideUp(500, function(){
            $(this).remove();
        });
    }, 4000);

    $( '#datefrom' ).datepicker();
    $( '#dateto' ).datepicker();

    /* Profile Pic */
    $('#profile-pic-chooser').change(function (e) {
        console.log($(this));
        let file = $(this).get(0).files[0];
        let reader = new FileReader();
        reader.addEventListener('load', () =>{
            $('#profile-pic-data-url').val(reader.result);
            $('#profile-pic-show').attr('src', reader.result);
            // console.log(reader.result);
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    })

    /* Select All */
	$('#checkAll').click(function () {
		$('.check').prop('checked', $(this).prop('checked'));
	});

    $('#userSearch').autocomplete({
        source: function (request, responce) {
            $.ajax({
                url: '/search',
                type: 'GET',
                data: { aliasFirstName: request.term },
                success: function (data) {
                    responce($.map(data, function (el) {
                        let fullName = el.aliasFirstName + ' ' + el.aliasLastName;
                        return {
                            label: fullName,
                            value: el._id
                        };
                    }));
                }
            });
        },

        focus: function (event, ul) {
            this.value = ul.item.label;
            event.preventDefault();
        }

    });

} );