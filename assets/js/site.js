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
  set('[data-cfg="profileImage"]', 'src', cfg.profileImage);

  if (cfg.author){
    document.querySelectorAll('[data-cfg="author"]').forEach(function(el){
      el.textContent = cfg.author;
    });
  }

  document.querySelectorAll('[data-cfg="emailLink"]').forEach(function(el){
    if (!cfg.feedbackEmail){ el.style.display = 'none'; return; }
    el.setAttribute('href', 'mailto:' + cfg.feedbackEmail);
    el.textContent = cfg.feedbackEmail;
  });

  // Video: if the file isn't there yet, fall back to the poster instead of a broken player.
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

  // Profile photo: show initials if the image can't load.
  document.querySelectorAll('.avatar img').forEach(function(img){
    function fail(){ img.parentNode.classList.add('no-photo'); img.style.display = 'none'; }
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
  });

  // ---------- rating box ----------
  var form = document.getElementById('rateForm');
  if (form){
    var labels = form.querySelectorAll('.stars label');
    var inputs = form.querySelectorAll('input[name="score"]');
    var msg = document.getElementById('rateMsg');
    var comment = document.getElementById('rateComment');
    var KEY = 'expressive-send-rating';

    function paint(n){
      labels.forEach(function(l, i){ l.classList.toggle('on', i < n); });
    }
    function current(){
      var c = form.querySelector('input[name="score"]:checked');
      return c ? parseInt(c.value, 10) : 0;
    }

    inputs.forEach(function(inp){
      inp.addEventListener('change', function(){ paint(current()); });
    });
    labels.forEach(function(l, i){
      l.addEventListener('mouseenter', function(){ paint(i + 1); });
      l.addEventListener('mouseleave', function(){ paint(current()); });
    });

    // restore a previous rating from this device
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved && saved.score){
        var box = form.querySelector('#s' + saved.score);
        if (box){ box.checked = true; paint(saved.score); }
        if (saved.comment) comment.value = saved.comment;
        msg.textContent = 'You rated this ' + saved.score + ' out of 5 earlier. You can change it.';
      }
    } catch (e) {}

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var score = current();
      if (!score){ msg.textContent = 'Please pick a star rating first.'; return; }
      var text = comment.value.trim();

      try { localStorage.setItem(KEY, JSON.stringify({ score: score, comment: text })); } catch (err) {}

      if (cfg.feedbackEmail){
        var subject = 'Expressive Send rating: ' + score + '/5';
        var body = 'Rating: ' + score + ' out of 5\n\n' + (text || '(no comment)');
        msg.textContent = 'Thank you. Your email app should open so you can send it.';
        window.location.href = 'mailto:' + encodeURIComponent(cfg.feedbackEmail) +
          '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      } else {
        msg.textContent = 'Thank you. You rated this ' + score + ' out of 5.';
      }
    });
  }
})();
