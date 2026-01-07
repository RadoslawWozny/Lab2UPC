let pageUrls = {
  about: "/index.html?about",
  contact: "/index.html?contact",
  gallery: "/index.html?gallery",
};
function OnStartUp() {
  popStateHandler();
}
OnStartUp();
document.querySelector("#about-link").addEventListener("click", (event) => {
  let stateObj = { page: "about" };
  document.title = "About";
  history.pushState(stateObj, "about", "?about");
  RenderAboutPage();
});
document.querySelector("#contact-link").addEventListener("click", (event) => {
  let stateObj = { page: "contact" };
  document.title = "Contact";
  history.pushState(stateObj, "contact", "?contact");
  RenderContactPage();
});
document.querySelector("#gallery-link").addEventListener("click", (event) => {
  let stateObj = { page: "gallery" };
  document.title = "Gallery";
  history.pushState(stateObj, "gallery", "?gallery");
  RenderGalleryPage();
});
function RenderAboutPage() {
  document.querySelector("main").innerHTML = `
 <h1 class="title">About Me</h1>
 <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`
  document.querySelector("#recaptcha").hidden = true;
}

function loadScript(src){
    var el = document.createElement("script");
    el.src = src;
    document.body.appendChild(el);
}

function RenderGalleryPage() {
  document.querySelector("main").innerHTML= `
  <div class="galeria">
  <div class="container">
    <h1>Gallery</h1>
    <div class="gallery-grid" id="galleryGrid" aria-live="polite">
    </div>
  </div>

  <div class="modal" id="imageModal" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="modal-content" id="modalContent">
      <button class="close-btn" id="modalClose" aria-label="zamknij">✕</button>
      <img id="modalImage" alt="Powiększone zdjęcie" />
    </div>
  </div>
  </div>
`
 loadScript("gallery.js");
 document.querySelector("#recaptcha").hidden = true;
}


function RenderContactPage() {
  document.querySelector("main").innerHTML = `
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
 <h1 class="title">Contact with me</h1>
 <form id="contact-form">
 <label for="name">Name:</label>
 <input type="text" id="name" name="name" required>
 <label for="email">Email:</label>
 <input type="email" id="email" name="email" required>
 <label for="message">Message:</label>
 <textarea id="message" name="message" required></textarea>
 <button type="submit">Send</button>
 </form>`
 
 document.querySelector("#recaptcha").hidden = false;
 //secret key = 6Le650IsAAAAAAFexgpnmt8w9stRSCbf2rCJyq_R
 //site key = 6Le650IsAAAAAIMBOM-32AQWHPdjeIOO8Tq1ax70



  document.getElementById("contact-form").addEventListener("submit", (event) => {
      var captcha_filled = grecaptcha.getResponse();
      if (!captcha_filled) {
        alert("Przeslanie formularza wymaga zrobienia reCAPTCHA \n event.preventDefault() \n (Formularz nie zostal przeslany)")
              event.preventDefault();
      } 
      else {
      alert("Form submitted!");
            event.preventDefault();
      }
      
      
    });
}
function popStateHandler() {
  let loc = window.location.href.toString().split(window.location.host)[1];
  if (loc === pageUrls.contact) {
    RenderContactPage();
  }
  if (loc === pageUrls.about) { 
    RenderAboutPage();
  }
}

function onClick(e) {
        e.preventDefault();
        grecaptcha.ready(function() {
          grecaptcha.execute('reCAPTCHA_site_key', {action: 'submit'}).then(function(token) {
      
          });
        });
      }



function onSubmit(token) {
     document.getElementById("demo-form").submit();
   }

   window.addEventListener('load', () => {
  const $recaptcha = document.querySelector('#g-recaptcha-response');
  if ($recaptcha) {
    $recaptcha.setAttribute('required', 'required');
  }
})




document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
window.onpopstate = popStateHandler;
