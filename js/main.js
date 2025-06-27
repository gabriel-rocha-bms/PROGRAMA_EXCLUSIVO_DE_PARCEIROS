// Configurações globais
const CONFIG = {
    MIN_PHONE_LENGTH: 10,
    MAX_PHONE_LENGTH: 11,
    INSTAGRAM_URL: 'https://www.instagram.com/bmsconsultoriatributaria/',
    WHATSAPP_NUMBER: '5521992884021'
};

// Classe principal da aplicação
class BMSPartnersApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavbar();
        this.setupFAQ();
        this.setupSmoothScroll();
        this.setupFormValidation();
        this.setupPhoneMask();
        this.setupInstagramFormat();
        this.setupLinkedInFormat();
        this.setupAnimations();
        this.setupFormSubmission();
        this.updateInstagramLinks();
    }

    // Navbar responsiva
    setupNavbar() {
        const navbar = document.querySelector('.navbar');
        const navbarToggle = document.querySelector('.navbar-toggle');
        const navbarMenu = document.querySelector('.navbar-menu');

        // Toggle do menu mobile
        if (navbarToggle && navbarMenu) {
            navbarToggle.addEventListener('click', () => {
                navbarMenu.classList.toggle('active');
                navbarToggle.innerHTML = navbarMenu.classList.contains('active') ? '✕' : '☰';
            });
        }

        // Scroll effect na navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.navbar-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (navbarMenu.classList.contains('active')) {
                    navbarMenu.classList.remove('active');
                    navbarToggle.innerHTML = '☰';
                }
            });
        });
    }

    // FAQ Accordion
    setupFAQ() {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                faqItem.classList.toggle('active');
                
                // Fecha outras FAQs
                document.querySelectorAll('.faq-item').forEach(item => {
                    if (item !== faqItem && item.classList.contains('active')) {
                        item.classList.remove('active');
                    }
                });
            });
        });
    }

    // Smooth Scroll
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Validação do formulário
    setupFormValidation() {
        const form = document.getElementById('bms-form');
        if (!form) return;

        const requiredFields = ['nome', 'cargo', 'segmento', 'email', 'telefone', 'rede', 'indicacoes'];
        
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            }
        });

        // Validação especial para telefone
        const phoneField = document.getElementById('telefone');
        if (phoneField) {
            phoneField.addEventListener('blur', () => this.validatePhone(phoneField));
        }

        // Validação de email
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('blur', () => this.validateEmail(emailField));
        }

        // Validação de LinkedIn
        const linkedinField = document.getElementById('linkedin');
        if (linkedinField) {
            linkedinField.addEventListener('blur', () => this.validateLinkedIn(linkedinField));
            linkedinField.addEventListener('input', () => this.clearFieldError(linkedinField));
        }
    }

    // Validação de campo individual
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        if (!value) {
            this.showFieldError(field, 'Este campo é obrigatório');
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    // Validação específica de telefone
    validatePhone(field) {
        const value = field.value.replace(/\D/g, '');
        
        if (value.length < CONFIG.MIN_PHONE_LENGTH) {
            this.showFieldError(field, `Telefone deve ter pelo menos ${CONFIG.MIN_PHONE_LENGTH} dígitos`);
            return false;
        }
        
        if (value.length > CONFIG.MAX_PHONE_LENGTH) {
            this.showFieldError(field, `Telefone deve ter no máximo ${CONFIG.MAX_PHONE_LENGTH} dígitos`);
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    // Validação de email
    validateEmail(field) {
        const value = field.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (value && !emailRegex.test(value)) {
            this.showFieldError(field, 'Digite um email válido');
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    // Validação de LinkedIn
    validateLinkedIn(field) {
        const value = field.value.trim();
        
        if (!value) return true; // Campo opcional
        
        // Aceita links com ou sem https://
        const linkedinPatterns = [
            /^https?:\/\/linkedin\.com\/in\/[\w\-]+$/i,
            /^https?:\/\/www\.linkedin\.com\/in\/[\w\-]+$/i,
            /^linkedin\.com\/in\/[\w\-]+$/i,
            /^www\.linkedin\.com\/in\/[\w\-]+$/i,
            /^[\w\-]+$/i // Apenas o nome do perfil
        ];
        
        const isValid = linkedinPatterns.some(pattern => pattern.test(value));
        
        if (!isValid) {
            this.showFieldError(field, 'Digite um perfil do LinkedIn válido (ex: linkedin.com/in/seu-perfil)');
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    // Mostrar erro no campo
    showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        let errorElement = field.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    // Limpar erro do campo
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    // Máscara para telefone
    setupPhoneMask() {
        const phoneField = document.getElementById('telefone');
        if (!phoneField) return;

        phoneField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limita o número de dígitos
            if (value.length > CONFIG.MAX_PHONE_LENGTH) {
                value = value.substr(0, CONFIG.MAX_PHONE_LENGTH);
            }
            
            // Aplica a máscara
            if (value.length > 0) {
                if (value.length <= 2) {
                    value = `(${value}`;
                } else if (value.length <= 7) {
                    value = `(${value.substr(0, 2)}) ${value.substr(2)}`;
                } else {
                    value = `(${value.substr(0, 2)}) ${value.substr(2, 5)}-${value.substr(7)}`;
                }
            }
            
            e.target.value = value;
        });
    }

    // Formatação do Instagram
    setupInstagramFormat() {
        const instagramField = document.getElementById('instagram');
        if (!instagramField) return;

        instagramField.addEventListener('input', function(e) {
            let value = e.target.value;
            // Remove @ duplicados e espaços
            value = value.replace(/[@\s]/g, '');
            // Adiciona @ no início se não estiver vazio
            if (value.length > 0) {
                e.target.value = '@' + value;
            }
        });
    }

    // Configurar formatação do LinkedIn
    setupLinkedInFormat() {
        // Função removida - não há mais auto preenchimento
        // O usuário pode digitar livremente
    }

    // Animações de entrada
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.8s ease-out';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observa elementos
        document.querySelectorAll('.step-card, .profile-card, .benefit-item').forEach(el => {
            observer.observe(el);
        });
    }

    // Envio do formulário
    setupFormSubmission() {
        const form = document.getElementById('bms-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Valida todos os campos obrigatórios
            const requiredFields = ['nome', 'cargo', 'segmento', 'email', 'telefone', 'rede', 'indicacoes'];
            let isValid = true;

            requiredFields.forEach(fieldName => {
                const field = document.getElementById(fieldName);
                if (field && !this.validateField(field)) {
                    isValid = false;
                }
            });

            // Validações específicas
            const phoneField = document.getElementById('telefone');
            if (phoneField && !this.validatePhone(phoneField)) {
                isValid = false;
            }

            const emailField = document.getElementById('email');
            if (emailField && !this.validateEmail(emailField)) {
                isValid = false;
            }

            const linkedinField = document.getElementById('linkedin');
            if (linkedinField && !this.validateLinkedIn(linkedinField)) {
                isValid = false;
            }

            if (!isValid) {
                alert('Por favor, corrija os erros no formulário antes de enviar.');
                return;
            }

            await this.submitForm(e);
        });
    }

    // Submissão do formulário
    async submitForm(e) {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyVYaCbWQV5YT3dD1z5slsYNhYecsYvflzTOgdUzE2DTGsrm6Q_wlx8lxzzqr--z26GJQ/exec';

        const formData = {
            nome: document.getElementById('nome').value,
            cargo: document.getElementById('cargo').value,
            empresa: document.getElementById('empresa').value,
            segmento: document.getElementById('segmento').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            rede: document.getElementById('rede').value,
            linkedin: document.getElementById('linkedin').value,
            instagram: document.getElementById('instagram').value,
            indicacoes: document.getElementById('indicacoes').value
        };

        try {
            const btn = e.target.querySelector("button[type='submit']");
            btn.disabled = true;
            btn.textContent = "Enviando...";

            await fetch(scriptURL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            setTimeout(() => {
                alert("Formulário enviado com sucesso!");
                document.getElementById("bms-form").reset();
                btn.disabled = false;
                btn.textContent = "Quero Ser Parceiro BMS";
            }, 1000);
        } catch (error) {
            console.error("Erro ao enviar:", error);
            alert("Erro ao enviar o formulário. Tente novamente mais tarde.");
            
            const btn = e.target.querySelector("button[type='submit']");
            btn.disabled = false;
            btn.textContent = "Quero Ser Parceiro BMS";
        }
    }

    // Atualizar links do Instagram
    updateInstagramLinks() {
        const instagramLinks = document.querySelectorAll('a[href*="instagram.com/bmsconsultoria"]');
        instagramLinks.forEach(link => {
            link.href = CONFIG.INSTAGRAM_URL;
        });
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new BMSPartnersApp();
});

// Utilitários
const Utils = {
    // Formatar número de telefone
    formatPhone: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `(${cleaned.substr(0, 2)}) ${cleaned.substr(2, 5)}-${cleaned.substr(7)}`;
        }
        return phone;
    },

    // Validar email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Scroll suave para elemento
    scrollToElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Mostrar notificação
    showNotification: (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}; 