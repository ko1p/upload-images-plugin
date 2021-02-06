function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (!bytes) {
        return '0 Byte'
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

const element = (tag, classes = [], content) => {
    const element = document.createElement(tag)
    if (classes.length) {
        element.classList.add(...classes)
    }
    if (content) {
        element.textContent = content
    }
    return element
}

const noop = () => {}

export function upload(selector, options = {}) {
    let files = []
    const input = document.querySelector(selector)
    const onUpload = options.onUpload ?? noop

    const open = element('button', ['btn'], 'Открыть')
    const preview = element('div', ['preview'])
    const upload = element('button', ['btn', 'primary'], 'Загрузить')
    upload.style.display = 'none'

    if (options.multi) {
        input.setAttribute('multiple', true)
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }

    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', upload)
    input.insertAdjacentElement('afterend', open)

    const triggerInput = () => input.click()

    const inputHandler = e => {
        preview.innerHTML = ''
        if (!e.target.files.length) {
            return
        }

        files = Array.from(e.target.files)
        upload.style.display = 'inline'

        files.forEach(file => {
            if (!file.type.match('image')) {
                console.log('Неверный формат файла', file.type)
                return
            }

            const reader = new FileReader()

            reader.onload = e => {
                preview.insertAdjacentHTML('afterbegin',`
                    <div class="preview-image">
                        <div class="preview-remove" data-name="${file.name}">&times;</div>
                        <img src="${e.target.result}" alt="${file.name}"/>
                        <div class="preview-info">
                            <span>${file.name}</span>
                            <span>${bytesToSize(file.size)}</span>
                        </div>
                    </div>
                `)
            }

            reader.readAsDataURL(file)

        })
    }

    const removeHandler = e => {
        if (!e.target.dataset.name) {
            return
        }

        const {name} = e.target.dataset
        files = files.filter(file => file.name !== name)

        if (!files.length) {
            upload.style.display = 'none'
        }

        const block = preview.querySelector(`[data-name="${name}"]`).parentNode
        block.remove()
    }

    const clearPreview = (el) => {
        el.style.opacity = 1
        el.innerHTML = '<div class="preview-info-progress"></div>'
    }

    const uploadHandler = e => {
        preview.querySelectorAll('.preview-remove').forEach(el => el.remove())
        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(el => clearPreview(el))
        onUpload(files, previewInfo)
    }

    open.addEventListener('click', triggerInput)
    input.addEventListener('change', inputHandler)
    preview.addEventListener('click', removeHandler)
    upload.addEventListener('click', uploadHandler)
}