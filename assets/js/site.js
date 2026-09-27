(function(){
  "use strict";
  var cfg = window.SITE_CONFIG || {};

  function set(sel, attr, value){
    if (!value) return;
    document.querySelectorAll(sel).forEach(function(el){
      el.setAttribute(attr, value);
    });
  }

  set('[data-cfg="prototypeUrl"]', 'href', cfg.prototypeUrl);
  set('[data-cfg="githubUrl"]', 'href', cfg.githubUrl);
  set('[data-cfg="caseStudyUrl"]', 'href', cfg.caseStudyUrl);
  set('[data-cfg="demoVideoSrc"]', 'src', cfg.demoVideoSrc);

  // If the configured video file isn't there yet (fresh clone, no demo.mp4),
  // fail quietly to the poster instead of showing a broken player.
  document.querySelectorAll('video[data-cfg="demoVideoSrc"]').forEach(function(video){
    video.addEventListener('error', function(){
      var poster = video.getAttribute('poster');
      video.style.display = 'none';
      var holder = video.closest('.phone-screen');
      if (holder && poster){
        var img = document.createElement('img');
        img.src = poster;
        img.alt = 'Expressive Send demo — video not yet added';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        holder.appendChild(img);
      }
    }, true);
  });
})();
