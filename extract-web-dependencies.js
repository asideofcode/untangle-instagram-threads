// Check if trustedTypes API is available and create a trusted type policy
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    try {
        // Create a trusted type policy to allow creating HTML strings
        window.trustedTypes.createPolicy('default', {
            createHTML: (string, sink) => string
        });
    } catch (e) {
        // Ignore any errors that occur during the creation of the policy
    }
}

// Fetch the HTML content from the specified URL
const response = await fetch("https://www.threads.net/t/CuZP2kksJk8");
const text = await response.text();

// Parse the HTML content into a DOM tree
const parser = new DOMParser();
const page = parser.parseFromString(text, 'text/html');

// Extract script URLs from <link> elements with 'as' attribute set to 'script'
const links = Array.from(page.querySelectorAll('link[as="script"]'), l => l.href);

// Fetch the script contents from the extracted URLs
const scriptPromises = links.map(async (link) => {
    const response = await fetch(link);
    return response.text();
});
const scripts = await Promise.all(scriptPromises);

// Extract dependencies using regex from the combined script contents
const regex = /__d\("([^"]+)"/g;
const dependencies = Array.from(scripts.join("\n").matchAll(regex), match => match[1]).sort();

// Output the dependencies as a JSON string
console.log(JSON.stringify(dependencies));
