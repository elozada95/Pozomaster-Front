import swal from 'sweetalert';

export function success(message) {
  swal("Good job!", message, "success");
}

export function error(message) {
  swal("Oh no! Something went wrong", message, "error");
}

export function confirm(message, callback) {
  swal(message, {
    buttons: {
      yes: "Yes",
      cancel: "Cancel"
    },
    icon: "info"
  })
  .then((value) => {
    switch(value) {
      case "yes":
        callback()
        break;
      case "cancel":
        break;
    }
  })
}
