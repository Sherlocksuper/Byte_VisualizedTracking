const rootElement = document.documentElement

const key = 'data-testid'
const tooltipPositionStore = []

// 其他：
// 和窗口边缘碰撞时候，会流出来10px的留白
const windowWhiteSpace = 10


const hasDataTestId = (node) => {
    if (node instanceof HTMLElement) {
        return node.hasAttribute(key)
    }
    return false
}

// targetElement: data-testid所在的元素
// 这里需要检查是否:
// 1. 和其他date-TestId碰撞
// 2. 和边缘碰撞
// 规则：
// 1. 和tooltip碰撞的话，高度升高
// 2. 和左右边缘碰撞的话，向相反的方向移动
const getTopAndLeftImpl = (targetElement, tooltip) => {
    const dataTestId = targetElement.getAttribute(key)
    const rect = targetElement.getBoundingClientRect()

    // tooltip的位置信息
    let top = rect.top + window.scrollY
    let left = rect.right + window.scrollX
    const width = tooltip.offsetWidth
    const height = tooltip.offsetHeight

    const windowLeft = windowWhiteSpace
    const windowRight = window.innerWidth - windowWhiteSpace

    // 检测是否和已有的tooltip碰撞
    for (let i = 0; i < tooltipPositionStore.length; i++) {
        const existingPosition = tooltipPositionStore[i];
        const existingTop = existingPosition.top;
        const existingLeft = existingPosition.left;
        const existingWidth = existingPosition.width;
        const existingHeight = existingPosition.height;

        const isCollide = () => {
            return !(top + height <= existingTop ||
                existingTop + existingHeight <= top ||
                left + width <= existingLeft ||
                existingLeft + existingWidth <= left);
        }

        if (isCollide()) {
            // 发生碰撞，修改position，这里简单示例向下移动10px
            console.log('self 碰撞了')
            top -= 10;
            // 这里减去1是为了重新检查碰撞
            i -= 1;
        }
    }

    //检测是否和左右边缘碰撞
    while (true) {
        // TODO: 此处不考虑左右滑动的界面,后续添加
        if (windowRight - windowLeft < width) break;

        if (left >= windowLeft && left + width <= windowRight)break;

        if (left < windowLeft) {
            left += 10
        } else if (left + width > windowLeft){
            left -= 10
        }
    }

    return { dataTestId, top, left , width, height, tooltip }
}


const getTopAndLeft = (targetElement,tooltip) => {
    const position = getTopAndLeftImpl(targetElement, tooltip);
    tooltipPositionStore.push(position)
    return position
}

const processOneElement = (node) => {
    if (node.childNodes.length >= 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
            processOneElement(node.childNodes[i])
        }
    }

    if (hasDataTestId(node)) {
        const element = node;
        const dataTestId = element.getAttribute(key);


        if (dataTestId) {
            const tooltip = document.createElement('div');
            tooltip.textContent = dataTestId;
            tooltip.style.display = 'block';
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'yellow';
            tooltip.style.padding = '2px';
            tooltip.style.zIndex = '1000';
            // 内容只在一行
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.overflow= "hidden";
            tooltip.style.textOverflow = 'ellipsis';

            // 先隐藏
            tooltip.style.visibility = 'hidden';

            document.body.appendChild(tooltip);

            tooltipPositionStore.push({ dataTestId, top: 0, left: 0, width: 0, height: 0, tooltip })
        }
    }
}

processOneElement(rootElement)

// 定义鼠标移入事件处理函数
const handleMouseOverShow = (event) => {
    const targetElement = event.target;
    const tooltip = tooltipPositionStore.findLast((item) => item.dataTestId === targetElement.getAttribute(key))?.tooltip;

    if (!tooltip) return;

    const { top, left } = getTopAndLeft(targetElement, tooltip);
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.visibility = 'visible';
};

// 定义鼠标移出事件处理函数
const handleMouseOverHide = (event) => {
    const targetElement = event.target;
    const tooltip = tooltipPositionStore.findLast((item) => item.dataTestId === targetElement.getAttribute(key))?.tooltip;

    if (!tooltip) return;

    tooltip.style.visibility = 'hidden';
    for (let i = 0; i < tooltipPositionStore.length; i++) {
        if (tooltipPositionStore[i].dataTestId === targetElement.getAttribute(key)) {
            tooltipPositionStore.splice(i, 1);
            break;
        }
    }
};

function start() {
    console.log('init');
    // 添加鼠标移入事件监听
    rootElement.addEventListener('mouseover', handleMouseOverShow);
    // 添加鼠标移出事件监听
    rootElement.addEventListener('mouseout', handleMouseOverHide);
}

function stop() {
    console.log('stop');
    // 移除鼠标移入事件监听
    rootElement.removeEventListener('mouseover', handleMouseOverShow);
    // 移除鼠标移出事件监听
    rootElement.removeEventListener('mouseover', handleMouseOverHide);
}

function toggleOpen() {
    const id = 'toggle-open'
    const element = document.getElementById(id)

    if (element) {
        const isChecked = element.checked;
        isChecked ? start() : stop()
    }
}

function showAll() {
    console.log('showAll')
}

function closeAll() {
    console.log('closeAll')
}

function toggleAll() {
    console.log('toggleAll')
}