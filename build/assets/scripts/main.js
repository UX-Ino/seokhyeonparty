// Kakao SDK 스크립트 동적 로드
function loadKakaoSDK(callback) {
  const script = document.createElement("script");
  script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
  script.onload = callback;
  document.head.appendChild(script);
}

// 카카오 SDK 초기화
window.onload = function () {
  loadKakaoSDK(() => {
    Kakao.init("937a6e2254897fcfacb4449b6fbe0fc1");

    // 진입 이벤트
    const loadingWrap = document.querySelector(".loading-wrap");
    const pageClassMain = document.querySelector(".pageClassMain");
    loadingWrap.style.display = "block";
    loadingWrap.style.opacity = "1";
    pageClassMain.style.display = "none";

    const LOADING_DURATION = 2500;
    const FADE_DURATION = 1000;
    setTimeout(() => {
      loadingWrap.style.opacity = "0";
      loadingWrap.style.transition = `opacity ${FADE_DURATION}ms ease-out`;
      setTimeout(() => {
        loadingWrap.style.display = "none";
        pageClassMain.style.display = "block";
        requestAnimationFrame(() => {
          pageClassMain.classList.add("show");
        });
      }, FADE_DURATION);
    }, LOADING_DURATION);

    // 디데이 카운트
    const countDownDate = new Date("Mar 16, 2025 15:00:00").getTime();
    const x = setInterval(function () {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.querySelector(".days .num").innerHTML = days;
      document.querySelector(".hours .num").innerHTML = hours;
      document.querySelector(".minutes .num").innerHTML = minutes;
      document.querySelector(".seconds .num").innerHTML = seconds;
      document.querySelector(".dday-desc .count").innerHTML = days + "일";

      if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "EXPIRED";
      }
    }, 1000);
  });
};

document.addEventListener("DOMContentLoaded", function () {
  loadKakaoSDK(() => {
    // 모달 관련 이벤트
    const $btnCallModal = document.querySelector(".btn-call-modal");
    const callModal = document.querySelector(".call-modal").ui;
    $btnCallModal.addEventListener("click", () => callModal.open());

    const $btnGuestModal = document.querySelector(".btn-messages");
    const guestModal = document.querySelector(".guest-modal").ui;
    $btnGuestModal.addEventListener("click", () => guestModal.open());

    // 갤러리 모달
    const $btnGallery = document.querySelectorAll(".btn-gallery");
    const galleryModal = document.querySelector(".gallery-modal").ui;
    const $btnMore = document.querySelector(".btn-more");

    const gallerySwiper = new Swiper(".gallery-swiper02", {
      effect: "fade",
      autoplay: false,
      loop: false,
      slidesPerView: 1,
      speed: 700,
      spaceBetween: 8,
      pagination: {
        el: ".custom-pagination",
        type: "custom",
        renderCustom: (swiper, current, total) => {
          const fillPer = (current / total) * 100;
          return `
            <div class="pagination-custom">
              <span>0<span class="current">${current}</span></span>
              <div class="progress__bar">
                <span class="progress__fill" style="width:${fillPer}%"></span>
              </div>
              <span>0${total}</span>
            </div>
          `;
        },
      },
    });

    $btnGallery.forEach((btn, index) => {
      if (index >= 16) btn.classList.add("hide");
      btn.addEventListener("click", () => {
        galleryModal.open();
        gallerySwiper.slideTo(index);
      });
    });

    let isExpanded = false;
    $btnMore.addEventListener("click", () => {
      isExpanded = !isExpanded;
      $btnGallery.forEach((btn, index) => {
        if (index >= 16) btn.classList.toggle("hide", !isExpanded);
      });
      $btnMore.textContent = isExpanded ? "접기" : "더보기";
    });

    // 입력시 버튼 활성화
    const inputFields = document.querySelectorAll(
      ".guest-modal input, .guest-modal textarea",
    );
    const submitButton = document.querySelector(".guest-modal .btn-submit");

    const checkInputs = () => {
      const allFilled = Array.from(inputFields).every(
        (input) => input.value.trim() !== "",
      );
      submitButton.disabled = !allFilled;
      if (allFilled) {
        submitButton.addEventListener("click", closeModal);
      } else {
        submitButton.removeEventListener("click", closeModal);
      }
    };

    const closeModal = () => {
      guestModal.close();
      resetInputs();
    };

    const resetInputs = () => {
      inputFields.forEach((input) => (input.value = ""));
      submitButton.disabled = true;
    };

    inputFields.forEach((input) => {
      input.addEventListener("input", checkInputs);
      input.addEventListener("blur", checkInputs);
    });

    const inputClearBtn = document.querySelectorAll(".input-field-btn.clear");
    inputClearBtn.forEach((button, index) => {
      button.addEventListener("click", () => {
        inputFields[index].value = "";
        checkInputs();
      });
    });

    // 네이버 지도 연결
    document.querySelector(".btn-naver").addEventListener("click", (e) => {
      e.preventDefault();
      const placeName = "플로렌스 보라매점";
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      const naverAppUrl = `nmap://search?query=${encodeURIComponent(placeName)}`;
      if (isMobile) {
        window.location.href = naverAppUrl;
        setTimeout(() => {
          if (/Android/i.test(navigator.userAgent)) {
            window.location.href = "market://details?id=com.nhn.android.nmap";
          } else {
            window.location.href = "http://itunes.apple.com/app/id311867728";
          }
        }, 1000);
      } else {
        window.open(
          `https://map.naver.com/v5/search/${encodeURIComponent(placeName)}`,
          "_blank",
        );
      }
    });

    // 카카오 내비 연결
    document.querySelector(".btn-kakao").addEventListener("click", () => {
      const placeName = "플로렌스파티하우스 보라매점";
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(placeName)}`;
      if (isMobile) {
        window.location.href = kakaoMapUrl;
      } else {
        window.open(kakaoMapUrl, "_blank");
      }
    });

    // 카카오뱅크 송금하기
    document
      .querySelector(".btn-kakaopay")
      .addEventListener("click", async () => {
        const accountNumber =
          document.querySelector(".account-num").textContent;
        const userChoice = confirm(
          "계좌번호를 복사하고 카카오뱅크 송금 화면으로 이동하시겠습니까?",
        );
        if (userChoice) {
          const copySuccess = await copyAccountNumber();
          if (copySuccess) {
            alert(
              "계좌번호가 클립보드에 복사되었습니다. 카카오뱅크 앱으로 이동합니다.",
            );
            openKakaoBank(accountNumber.replace(/[^0-9]/g, ""));
          } else {
            alert(
              "계좌번호 복사에 실패했습니다. 카카오뱅크 앱으로만 이동합니다.",
            );
            openKakaoBank("");
          }
        }
      });

    // 계좌번호 복사
    document.querySelector(".btn-copy").addEventListener("click", async () => {
      const copySuccess = await copyAccountNumber();
      if (copySuccess) {
        const moveToBank = confirm(
          "계좌번호가 복사되었습니다. 카카오뱅크 송금 화면으로 이동하시겠습니까?",
        );
        if (moveToBank) {
          const accountNumber =
            document.querySelector(".account-num").textContent;
          openKakaoBank(accountNumber.replace(/[^0-9]/g, ""));
        }
      } else {
        alert("계좌번호 복사에 실패했습니다.");
      }
    });

    // 카카오 초기화 및 공유하기 설정
    try {
      if (!Kakao.isInitialized()) {
        Kakao.init("937a6e2254897fcfacb4449b6fbe0fc1");
      }
    } catch (e) {
      console.error("Kakao init error:", e);
    }

    const shareButton = document.querySelector(".btn-kakaoshare");
    shareButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof Kakao === "undefined") {
        console.error("Kakao SDK가 로드되지 않았습니다.");
        alert("카카오 SDK를 불러올 수 없습니다.");
        return;
      }
      if (!Kakao.isInitialized()) {
        try {
          Kakao.init("937a6e2254897fcfacb4449b6fbe0fc1");
        } catch (error) {
          console.error("Kakao 재초기화 실패:", error);
          alert("카카오 기능을 사용할 수 없습니다.");
          return;
        }
      }
      try {
        Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "석현이의 돌잔치에 초대합니다.",
            description:
              "2025년 3월 16일 일요일 오후 3시\n플로렌스파티하우스 보라매점 29층",
            imageUrl:
              "https://seokhyeonparty.netlify.app/assets/images/img-intro.jpeg",
            link: {
              webUrl: "https://seokhyeonparty.netlify.app",
              mobileWebUrl: "https://seokhyeonparty.netlify.app",
            },
          },
        });
      } catch (error) {
        console.error("카카오 공유하기 에러:", error);
        alert("카카오톡 공유하기를 사용할 수 없습니다.");
      }
    });

    // 링크 복사
    document.querySelector(".btn-link").addEventListener("click", () => {
      const currentUrl = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(currentUrl)
          .then(() => {
            alert("링크가 클립보드에 복사되었습니다.");
          })
          .catch((err) => {
            console.error("링크 복사 실패:", err);
          });
      } else {
        const tempInput2 = document.createElement("input");
        tempInput2.readOnly = true;
        tempInput2.value = currentUrl;
        document.body.appendChild(tempInput2);
        tempInput2.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput2);
        alert("링크가 클립보드에 복사되었습니다.");
      }
    });

    // 스크롤 이벤트
    document.addEventListener("scroll", () => {
      const sections = document.querySelectorAll(".contents-layer-wrap");
      const scrollPosition = window.scrollY + window.innerHeight;
      sections.forEach((section) => {
        if (section.offsetTop < scrollPosition) {
          section.classList.add("fade-in");
        } else {
          section.classList.remove("fade-in");
        }
      });
    });
  });
});

// Supabase 클라이언트 설정
const supabaseUrl = "https://cnimbijddrxtbqkljwml.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuaW1iaWpkZHJ4dGJxa2xqd21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MzA3OTQsImV4cCI6MjA1NDAwNjc5NH0.c2wSz6JvkAqW_k6Cui5ygvUPWu-NydXdZaAC1JVsMYI";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 댓글 로드 함수
async function loadComments() {
  try {
    const { data, error } = await supabaseClient
      .from("seokhyeonpartyDb")
      .select("*")
      .order("date", { ascending: false });
    if (error) throw error;

    const commentList = document.querySelector(".messages-wrap");
    if (!commentList) {
      console.error("댓글 목록 컨테이너를 찾을 수 없습니다");
      return;
    }
    if (!data || data.length === 0) {
      commentList.innerHTML = "<p>아직 댓글이 없습니다.</p>";
      return;
    }
    commentList.innerHTML = "";
    data.forEach((comment) => {
      const commentDate = new Date(comment.date);
      const kstDate = new Date(commentDate.getTime() + 9 * 60 * 60 * 1000);
      const formattedDate = kstDate.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Seoul",
      });
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="messages-box">
          <div class="top">
            <span class="name">${comment.author}</span>
            <span class="time">${formattedDate}</span>
            <button class="btn-del" data-comment-id="${comment.id}">
              <span class="hide-txt">삭제</span>
              <i class="ico ico-del"></i>
            </button>
          </div>
          <div class="bottom">${comment.comment}</div>
        </div>
      `;
      commentList.appendChild(div);

      const deleteButton = div.querySelector(".btn-del");
      deleteButton.addEventListener("click", async () => {
        const password = prompt("비밀번호를 입력하세요.");
        if (!password) return;
        try {
          const { data: commentData, error: commentError } =
            await supabaseClient
              .from("seokhyeonpartyDb")
              .select("password")
              .eq("id", comment.id)
              .single();
          if (commentError) throw commentError;
          if (commentData.password === password) {
            const { error: deleteError } = await supabaseClient
              .from("seokhyeonpartyDb")
              .delete()
              .eq("id", comment.id);
            if (deleteError) throw deleteError;
            alert("댓글이 삭제되었습니다.");
            loadComments();
          } else {
            alert("비밀번호가 일치하지 않습니다.");
          }
        } catch (error) {
          console.error("댓글 삭제 중 오류 발생:", error);
          alert("댓글 삭제에 실패했습니다.");
        }
      });
    });
  } catch (error) {
    console.error("댓글 로딩 에러:", error);
  }
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".comment-form");
  const submitButton = form ? form.querySelector(".btn-submit") : null;
  if (form && submitButton) {
    form.querySelectorAll(".input-field-btn.clear").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const input = button
          .closest(".input-field")
          .querySelector(".input, .textarea");
        if (input) {
          input.value = "";
          checkFormValidity();
        }
      });
    });

    const passwordToggle = form.querySelector(".password-state");
    if (passwordToggle) {
      passwordToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const passwordInput = document.getElementById("password");
        if (passwordInput) {
          passwordInput.type =
            passwordInput.type === "password" ? "text" : "password";
          passwordToggle.classList.toggle("show");
        }
      });
    }

    const checkFormValidity = () => {
      const author = document.getElementById("author").value.trim();
      const password = document.getElementById("password").value.trim();
      const comment = document.getElementById("comment").value.trim();
      submitButton.disabled = !(author && password && comment);
    };

    form.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", checkFormValidity);
    });

    submitButton.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!submitButton.disabled) {
        const author = document.getElementById("author").value.trim();
        const password = document.getElementById("password").value.trim();
        const comment = document.getElementById("comment").value.trim();
        try {
          const { error } = await supabaseClient
            .from("seokhyeonpartyDb")
            .insert([
              { author, password, comment, date: new Date().toISOString() },
            ]);
          if (error) throw error;
          alert("댓글이 작성되었습니다!");
          form.reset();
          submitButton.disabled = true;
          loadComments();
        } catch (error) {
          console.error("에러:", error);
          alert("댓글 작성 실패: " + error.message);
        }
      }
    });

    loadComments();
  }
});

// 계좌번호 복사 함수
async function copyAccountNumber() {
  const accountNumber = document.querySelector(".account-num").textContent;
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(accountNumber);
      return true;
    } else {
      // Clipboard API를 지원하지 않는 경우
      const tempInput = document.createElement("input");
      tempInput.readOnly = true;
      tempInput.value = accountNumber;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      return true;
    }
  } catch (err) {
    console.error("복사 실패:", err);
    return false;
  }
}
// 카카오뱅크 송금 함수
function openKakaoBank(accountNumber) {
  // 카카오뱅크 송금 URL 스키마 (계좌번호 포함)
  const kakaoBankUrl = `kakaobank://transfer?receiver_acc=${accountNumber}`;
  window.location.href = kakaoBankUrl;
}
