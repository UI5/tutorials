function getUrlParameter(name) {
	name = name.replace(/[\[\]]/g, "\\$&");
	let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	let results = regex.exec(window.location.href);
	if (!results) return null;
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function initializeLanguage(forcedLang = null) {
	let lang = forcedLang || getUrlParameter("lang");
	if (lang !== "js") {
		lang = "ts";
	}

	// set top-level CSS class based on current language
	document.body.classList.remove("page-language-js", "page-language-ts"); // for later switching
	document.body.classList.add("page-language-" + lang);

	return lang;
}

/* this function finds all tags which have both CSS classes "language-ts" and "highlighter-rouge"
  and have exactly one direct neighbor sibling tag, which has the classes "language-ts" and "highlighter-rouge".
  It then wraps both tags in a new div tag. */
function boxJSTSCouples() {
	const tsTags = document.querySelectorAll(".language-ts");
	tsTags.forEach(function (tsTag) {
		const nextSibling = getNextSibling(tsTag, "js");
		const previousSibling = getPreviousSibling(tsTag, "js");
		if (nextSibling && previousSibling) {
			// three subsequent code blocks, not clear what belongs to what
			return;
		} else if (!nextSibling && !previousSibling) {
			// no direct sibling code block with different language
			return;
		} else if (nextSibling && getNextSibling(nextSibling)) {
			// three subsequent code blocks, not clear what belongs to what
			return;
		} else if (previousSibling && getPreviousSibling(previousSibling)) {
			// three subsequent code blocks, not clear what belongs to what
			return;
		}
		const jsTag = nextSibling || previousSibling;

		// we have two direct sibling code blocks with different languages; wrap them in a new div tag with nice switch button
		const wrapper = document.createElement("div");
		wrapper.classList.add("code-couple");

		const tsButton = document.createElement("button");
		const jsButton = document.createElement("button");
		tsButton.classList.add("code-couple-button");
		tsButton.classList.add("code-couple-button-ts");
		tsButton.textContent = "TypeScript";
		tsButton.addEventListener("click", function () {
			// TODO: lots of redundant code to the one below
			switchCodeCouple(wrapper, "ts");
		});
		wrapper.appendChild(tsButton);

		jsButton.classList.add("code-couple-button");
		jsButton.classList.add("code-couple-button-js");
		jsButton.textContent = "JavaScript";
		jsButton.addEventListener("click", function () {
			switchCodeCouple(wrapper, "js");
		});
		wrapper.appendChild(jsButton);
		tsTag.parentNode.insertBefore(wrapper, tsTag); // do this before tsTag is moved inside the wrapper

		const wrapperContainer = document.createElement("div");
		wrapperContainer.classList.add("code-couple-container");
		wrapperContainer.appendChild(tsTag);
		wrapperContainer.appendChild(jsTag);
		wrapper.appendChild(wrapperContainer);
	});
}

function switchCodeCouple(wrapper, lang) {
	const tsTag = wrapper.querySelector(".language-ts");
	const jsTag = wrapper.querySelector(".language-js");
	const tsButton = wrapper.querySelector(".code-couple-button-ts");
	const jsButton = wrapper.querySelector(".code-couple-button-js");

	tsTag.style.display = lang === "ts" ? "block" : "none";
	jsTag.style.display = lang === "js" ? "block" : "none";

	tsButton.classList.toggle("code-couple-button-active", lang === "ts");
	tsButton.classList.toggle("code-couple-button-inactive", lang === "js");
	jsButton.classList.toggle("code-couple-button-active", lang === "js");
	jsButton.classList.toggle("code-couple-button-inactive", lang === "ts");

	wrapper.dataset.activeLang = lang;
}

function resetCodeCoupleButtons() {
	const buttons = document.querySelectorAll(".code-couple-button");
	buttons.forEach((button) => {
		button.classList.remove(
			"code-couple-button-active",
			"code-couple-button-inactive"
		);
	});
}

function getPreviousSibling(tag, lang) {
	const previousSibling =
		tag.previousElementSibling &&
		(tag.previousElementSibling.classList.contains("highlighter-rouge") ||
			tag.nextElementSibling.classList.contains("hljs"))
			? tag.previousElementSibling
			: null;
	if (
		!lang ||
		(previousSibling &&
			(previousSibling.classList.contains("language-" + lang) ||
				previousSibling.classList.contains("highlight-source-" + lang)))
	) {
		// success if lang does not matter or lang is as requested
		return previousSibling;
	}
	return null;
}

function getNextSibling(tag, lang) {
	const nextSibling =
		tag.nextElementSibling &&
		(tag.nextElementSibling.classList.contains("highlighter-rouge") ||
			tag.nextElementSibling.classList.contains("hljs"))
			? tag.nextElementSibling
			: null;
	if (
		!lang ||
		(nextSibling &&
			(nextSibling.classList.contains("language-" + lang) ||
				nextSibling.classList.contains("highlight-source-" + lang)))
	) {
		// success if lang does not matter or lang is as requested
		return nextSibling;
	}
	return null;
}

/**
 * This function finds all <details> tags with either the CSS class "ts-only" or "js-only" and:
 * 1. removes their <summary> tag
 * 2. replaces the <details> tag with a <section> tagr
 */
function replaceDetailSections() {
	const detailTags = document.querySelectorAll(
		"details.ts-only, details.js-only"
	);
	detailTags.forEach(function (detailTag) {
		// create a new section tag before the detail tag
		const sectionTag = document.createElement("section");
		detailTag.parentNode.insertBefore(sectionTag, detailTag);

		// copy over the either ts-only or js-only class to the new section tag
		const lang = detailTag.classList.contains("ts-only") ? "ts" : "js";
		sectionTag.classList.add(lang + "-only");

		// move all children of the detail tag to the new section tag, except the <summary> tag
		const children = Array.from(detailTag.children);
		children.forEach(function (child) {
			if (child.tagName.toLocaleUpperCase() === "SUMMARY") {
				return;
			}
			// only add the child if it has content
			if (child.innerHTML.trim()) {
				sectionTag.appendChild(child);
			}
		});

		// remove the detail tag
		detailTag.parentNode.removeChild(detailTag);
	});
}

function replaceFileExtensions(lang) {
	const replacement =
		"<span class='ts-only'>.ts</span><span class='js-only'>.js</span>";

	// select all text nodes in the body
	const walker = document.createTreeWalker(
		document.body,
		NodeFilter.SHOW_TEXT,
		null,
		false
	);
	let node = walker.nextNode();

	// iterate over each text node
	while (node) {
		let nextNode = walker.nextNode();
		if (node.nodeValue.includes(".?s")) {
			const temp = document.createElement("div");
			temp.innerHTML = node.nodeValue.replace(/\.\?s/g, replacement);

			const fragment = document.createDocumentFragment();
			while (temp.firstChild) {
				fragment.appendChild(temp.firstChild);
			}

			node.parentNode.replaceChild(fragment, node);
		} else if (node.nodeValue.includes(".\\?s")) {
			node.nodeValue = node.nodeValue.replace(/\.\\\?s/g, ".?s");
		}
		node = nextNode;
	}
}

function updatePrevNextLinks(lang) {
    const links = document.querySelectorAll('a[href$="README.md"], a[href$="/"], a[href$="README.md?lang=js"], a[href$="/?lang=js"]');
    links.forEach(link => {
		// Only handle relative links (not starting with http://, https://, or //)
        if (/^(https?:)?\/\//.test(link.getAttribute("href"))) {
            return;
        }

        let url = new URL(link.href, window.location.origin);

        // Remove any existing lang param
        url.searchParams.delete("lang");

        if (lang === "js") {
            url.searchParams.set("lang", "js");
        }

        link.href = url.pathname + url.search + url.hash;
    });
}

// dynamic overall language switching

function addLanguageSwitchButtons() {
	const buttonContainer = document.createElement("div");
	buttonContainer.classList.add("language-switch-container");

	const tsButton = createLanguageButton("TS", "ts");
	const jsButton = createLanguageButton("JS", "js");

	buttonContainer.appendChild(tsButton);
	buttonContainer.appendChild(jsButton);
	document.body.appendChild(buttonContainer);
}

function createLanguageButton(text, lang) {
	const button = document.createElement("button");
	button.textContent = text;
	button.classList.add("language-switch-button");
	button.classList.add("lang-" + lang);
	button.addEventListener("click", () => switchLanguage(lang));
	return button;
}

function switchLanguage(newLang) {
	const lang = initializeLanguage(newLang);
	replaceFileExtensions(lang);
	resetCodeCoupleButtons();
	updateAllCodeCouples(lang);
	updatePrevNextLinks(lang);
}

function updateAllCodeCouples(globalLang) {
	const codeCouples = document.querySelectorAll(".code-couple");
	codeCouples.forEach((couple) => {
		switchCodeCouple(couple, globalLang);
	});
}

// initialization on startup

document.addEventListener("DOMContentLoaded", (event) => {
	setTimeout(() => {
		const lang = initializeLanguage();
		replaceDetailSections();
		boxJSTSCouples(); // should happen after replaceDetailSections, so all couples are recognized
		replaceFileExtensions(lang);
		addLanguageSwitchButtons();
		updateAllCodeCouples(lang);
		updatePrevNextLinks(lang);
	});
});
