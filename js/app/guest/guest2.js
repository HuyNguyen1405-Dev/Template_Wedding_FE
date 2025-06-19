/**
     * @returns {void}
     */
const domLoaded = () => {
    lang.init();
    offline.init();
    progress.init();

    config = storage('config');
    information = storage('information');

    const img = image.init();
    const aud = audio.init();
    const cfi = loaderConfetti();
    const token = document.body.getAttribute('data-key');
    const params = new URLSearchParams(window.location.search);

    window.addEventListener('resize', util.debounce(slide));
    document.addEventListener('undangan.progress.done', () => booting());
    document.addEventListener('hide.bs.modal', () => document.activeElement?.blur());
    document.getElementById('button-modal-download').addEventListener('click', (e) => {
        img.download(e.currentTarget.getAttribute('data-src'));
    });


    if (!token || token.length <= 0) {
        img.load();
        aud.load();
        cfi.load(document.body.getAttribute('data-confetti') === 'true');

        document.getElementById('comment')?.remove();
        document.querySelector('a.nav-link[href="#comment"]')?.closest('li.nav-item')?.remove();
    }

    if (token && token.length > 0) {
        // add 2 progress for config and comment.
        // before img.load();
        progress.add();
        progress.add();

        // if don't have data-src.
        if (!img.hasDataSrc()) {
            img.load();
        }

        // fetch after document is loaded.
        const loader = () => session.guest(params.get('k') ?? token).then(({ data }) => {
            progress.complete('config');

            if (img.hasDataSrc()) {
                img.load();
            }

            aud.load();
            comment.init();
            const fetchComments = async () => {
                try {
                    const response = await fetch("http://localhost:9001/api/v2/comment1"); // Đổi URL nếu bạn deploy
                    const data = await response.json();

                    const container = document.getElementById('comments');
                    if (!container) return;

                    container.innerHTML = ''; // Xoá toàn bộ lời chúc cũ (nếu có)
                    (data?.data?.lists || []).forEach((item) => {
                        const div = document.createElement('div');
                        div.classList.add('bg-theme-auto', 'rounded-4', 'shadow', 'p-3', 'my-2');

                        div.innerHTML = `
                        <p class="fw-bold mb-1">${item.name} (${item.presence == 1 ? '✅ Sẽ tham dự' : item.presence == 2 ? '❌ Không tham dự' : '❓ Chưa xác định'})</p>
                        <p class="m-0">${item.comment}</p>
                        `;

                        container.appendChild(div); // 👉 bạn đã thiếu dòng này trong khối `try`
                    });
                } catch (err) {
                    console.error('Lỗi khi tải lời chúc:', err);
                }
            };
            cfi.load(data.is_confetti_animation);

            fetchComments()
                .then(() => progress.complete('comment'))
                .catch(() => progress.invalid('comment'));

        }).catch(() => progress.invalid('config'));

        window.addEventListener('load', loader);
    }
};