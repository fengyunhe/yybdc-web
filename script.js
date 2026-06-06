// ===== VocabFloat Website Script =====

// Create floating particles
function createParticles() {
    const particlesBg = document.getElementById('particles');
    if (!particlesBg) return;

    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 20}s;
            animation-duration: ${15 + Math.random() * 20}s;
            opacity: ${0.3 + Math.random() * 0.4};
        `;
        particlesBg.appendChild(particle);
    }
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navbarLinks = document.querySelector('.navbar-links');

    if (!mobileMenuBtn || !navbarLinks) return;

    mobileMenuBtn.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when clicking a link
    navbarLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navbarLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        scrollObserver.observe(el);
    });
}

// Load release info
async function loadReleaseInfo() {
    try {
        const res = await fetch("latest-release.json");
        if (!res.ok) return;

        const data = await res.json();

        const versionDisplay = document.getElementById("version-display");
        if (versionDisplay) {
            versionDisplay.textContent = `最新版本: v${data.version}`;
        }

        const footerVersion = document.getElementById("footer-version");
        if (footerVersion) {
            footerVersion.textContent = `VocabFloat v${data.version}`;
        }

        const macosLink = document.getElementById("macos-link");
        if (macosLink && data.macos_url) {
            macosLink.href = data.macos_url;
        }

        const windowsLink = document.getElementById("windows-link");
        if (windowsLink && data.windows_url) {
            windowsLink.href = data.windows_url;
        }

        const linuxLink = document.getElementById("linux-link");
        if (linuxLink && data.linux_url) {
            linuxLink.href = data.linux_url;
        }

        // 备用下载链接
        function getBackupUrl(url) {
            return "https://0.z1z.link/https/" + url.replace(/^https?:\/\//, "");
        }

        const macosBackupLink = document.getElementById("macos-backup-link");
        if (macosBackupLink && data.macos_url) {
            macosBackupLink.href = getBackupUrl(data.macos_url);
            macosBackupLink.style.display = "";
        }

        const windowsBackupLink = document.getElementById("windows-backup-link");
        if (windowsBackupLink && data.windows_url) {
            windowsBackupLink.href = getBackupUrl(data.windows_url);
            windowsBackupLink.style.display = "";
        }

        const linuxBackupLink = document.getElementById("linux-backup-link");
        if (linuxBackupLink && data.linux_url) {
            linuxBackupLink.href = getBackupUrl(data.linux_url);
            linuxBackupLink.style.display = "";
        }
    } catch (e) {
        console.error("Failed to load release info:", e);
    }
}

// Load FAQ
async function loadFAQ() {
    const faqList = document.getElementById("faq-list");
    if (!faqList) return;

    try {
        const res = await fetch("faq.json");
        if (!res.ok) throw new Error("Failed to load faq.json");

        const faqData = await res.json();

        if (!faqData || faqData.length === 0) {
            faqList.innerHTML = '<p class="loading-text">暂无常见问题</p>';
            return;
        }

        faqList.innerHTML = faqData.map((item, index) => `
            <div class="faq-item" data-index="${index}">
                <div class="faq-question">
                    <span>${item.question}</span>
                    <span class="faq-icon">+</span>
                </div>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');

        // Add click handlers
        faqList.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.parentElement;
                const wasActive = faqItem.classList.contains('active');

                // Close all other items
                faqList.querySelectorAll('.faq-item.active').forEach(item => {
                    item.classList.remove('active');
                });

                // Toggle current item
                if (!wasActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    } catch (e) {
        console.error("Failed to load FAQ:", e);
        faqList.innerHTML = '<p class="loading-text">加载失败，请刷新重试</p>';
    }
}

// Initialize Gallery
function initGallery() {
    const galleryContainer = document.getElementById('galleryContainer');
    const galleryImage = document.getElementById('galleryImage');
    const galleryTitle = document.querySelector('.gallery-title');
    const galleryDescription = document.querySelector('.gallery-description');
    const galleryThumbnails = document.querySelectorAll('.gallery-thumb');
    const galleryDots = document.querySelectorAll('.gallery-dot');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');

    if (!galleryContainer || !galleryImage) return;

    let currentIndex = 0;
    const images = [
        { src: 'images/单词卡片界面.png', title: '单词卡片界面', desc: '直观清晰的单词展示，支持音标、释义和例句' },
        { src: 'images/设置主界面.png', title: '设置主界面', desc: '调整切换间隔、显示选项、播放设置等参数，让学习体验完全符合你的习惯' },
        { src: 'images/主题编辑器.png', title: '主题编辑器', desc: '自由定制颜色、背景图片、透明度，创建专属学习主题' },
        { src: 'images/迷你界面.png', title: '迷你模式', desc: '紧凑的单词展示，最小化占用屏幕空间' },
        { src: 'images/单词卡片界面.png', title: '单词卡片界面', desc: '完整的单词卡片展示，包含音标、释义、例句和控制按钮' },
        { src: 'images/右键菜单-切换主题.png', title: '快捷右键菜单', desc: '一键切换主题、词本，操作便捷高效' }
    ];

    function updateGallery(index) {
        currentIndex = index;

        // Update main image
        galleryImage.style.transform = 'scale(0.95)';
        setTimeout(() => {
            galleryImage.src = images[index].src;
            galleryImage.style.transform = 'scale(1)';
        }, 150);

        // Update info
        galleryTitle.textContent = images[index].title;
        galleryDescription.textContent = images[index].desc;

        // Update thumbnails
        galleryThumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Update dots
        galleryDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Previous button
    prevBtn.addEventListener('click', () => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        updateGallery(newIndex);
    });

    // Next button
    nextBtn.addEventListener('click', () => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        updateGallery(newIndex);
    });

    // Thumbnail clicks
    galleryThumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            updateGallery(index);
        });
    });

    // Dot clicks
    galleryDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateGallery(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
            updateGallery(newIndex);
        } else if (e.key === 'ArrowRight') {
            const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
            updateGallery(newIndex);
        }
    });

    // Auto-play (optional - uncomment to enable)
    // setInterval(() => {
    //     const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    //     updateGallery(newIndex);
    // }, 5000);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initNavbarScroll();
    initMobileMenu();
    initScrollAnimations();
    loadReleaseInfo();
    loadFAQ();
    initGallery();
});
