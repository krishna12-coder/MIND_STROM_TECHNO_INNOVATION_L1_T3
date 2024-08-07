document.addEventListener('DOMContentLoaded', function() {
    const blogForm = document.getElementById('blog-form');
    const titleInput = document.getElementById('title-input');
    const contentInput = document.getElementById('content-input');
    const blogList = document.getElementById('blog-list');

    async function fetchPosts() {
        const response = await fetch('/posts');
        const posts = await response.json();
        return posts;
    }

    async function addPost(title, content) {
        const response = await fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content, read: false }),
        });
        return response.json();
    }

    async function deletePost(index) {
        await fetch(`/posts/${index}`, {
            method: 'DELETE',
        });
    }

    async function toggleRead(index, read) {
        await fetch(`/posts/${index}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ read }),
        });
    }

    function renderPosts(posts) {
        blogList.innerHTML = '';
        posts.forEach((post, index) => {
            const li = document.createElement('li');
            if (post.read) {
                li.classList.add('read');
            }

            const postTitle = document.createElement('h2');
            postTitle.textContent = post.title;
            li.appendChild(postTitle);

            const postContent = document.createElement('p');
            postContent.textContent = post.content;
            li.appendChild(postContent);

            const readButton = document.createElement('button');
            readButton.textContent = post.read ? 'Unread' : 'Read';
            readButton.addEventListener('click', async () => {
                await toggleRead(index, !post.read);
                const updatedPosts = await fetchPosts();
                renderPosts(updatedPosts);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                await deletePost(index);
                const updatedPosts = await fetchPosts();
                renderPosts(updatedPosts);
            });

            li.appendChild(readButton);
            li.appendChild(deleteButton);
            blogList.appendChild(li);
        });
    }

    blogForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        if (title && content) {
            await addPost(title, content);
            const updatedPosts = await fetchPosts();
            renderPosts(updatedPosts);
            titleInput.value = '';
            contentInput.value = '';
        }
    });

    fetchPosts().then(renderPosts);
});
