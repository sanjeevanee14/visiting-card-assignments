class IssueComponent extends HTMLElement {
    static observedAttributes = ["config", "data"];

    defaultConfig = {
        formLabel: "form-label",
        formClass: "form-control",
        buttonClass: "btn btn-primary mt-3"
    };

    config = {};
    data = [];

    constructor() {
        super();
        this.config = { ...this.defaultConfig };
    }

    connectedCallback() {
        this.renderComponent();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        try {
            if (name === "config" && typeof newValue === "string") {
                this.config = { ...this.config, ...JSON.parse(newValue) };
            }
            if (name === "data" && typeof newValue === "string") {
                this.data = JSON.parse(newValue);
            }
        } catch (e) {
            console.error("Error parsing attributes:", e);
        }

        this.renderComponent();
    }

    renderComponent() {
        this.innerHTML = "";

        const form = document.createElement("form");

        // Render fields for the "data" array
        this.data.forEach((field) => {
            const formGroup = this.createFormGroup(field);
            form.appendChild(formGroup);
        });

        // Add Submit Button
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.className = this.config.buttonClass;
        submitButton.textContent = "Submit";

        form.appendChild(submitButton);
        this.appendChild(form);

        // Add Submit Event Listener with Validation
        form.addEventListener("submit", (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                alert("Please fill in all required fields.");
                return;
            }

            event.preventDefault();

            const formData = {};
            const inputs = form.querySelectorAll("input");
            inputs.forEach((input) => {
                formData[input.name] = input.value;
            });

            console.log(JSON.stringify(formData, null, 4)); // Logs output in desired JSON format
        });
    }

    createFormGroup(field) {
        const formGroup = document.createElement("div");
        formGroup.className = "mb-3";

        const label = document.createElement("label");
        label.className = this.config.formLabel;
        label.textContent = field.label;

        const input = document.createElement("input");
        input.type = field.type || "text";
        input.className = this.config.formClass;
        input.name = field.label.replace(/\s+/g, "").toLowerCase(); // Use a sanitized name
        input.placeholder = field.placeholder || "";
        input.required = field.required || false;

        formGroup.appendChild(label);
        formGroup.appendChild(input);

        return formGroup;
    }
}

customElements.define("issue-component", IssueComponent);
