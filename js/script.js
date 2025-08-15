// Tab Switching
function switchTab(tabId, element) {
  // Hide all content
  document.querySelectorAll('.content').forEach(content => {
    content.classList.add('hidden');
  });

  // Remove active from all
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  // Show selected
  document.getElementById(tabId).classList.remove('hidden');

  // Activate clicked
  element.classList.add('active');
}

// Payment Modal Functions
function openPaymentModal(packageName, packagePrice) {
  document.getElementById('packageName').value = packageName;
  document.getElementById('packagePrice').value = packagePrice;
  document.getElementById('displayPackageName').value = packageName;
  document.getElementById('displayPackagePrice').value = 'KSH ' + packagePrice;
  document.getElementById('mpesaPhone').value = '';
  document.getElementById('paymentModal').style.display = 'flex';
  document.getElementById('mpesaPhone').focus();
}

function closePaymentModal() {
  document.getElementById('paymentModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById('paymentModal');
  if (event.target === modal) {
    closePaymentModal();
  }
}

// Phone number formatting
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('mpesaPhone').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('7') && value.length <= 9) {
      value = '254' + value;
    }
    e.target.value = value;
  });

  // Handle form submission
  document.getElementById('mpesaPaymentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const cancelBtn = this.querySelector('button[type="button"]');
    const spinner = document.getElementById('paymentSpinner');
    const originalBtnText = submitBtn.textContent;

    // Show loading
    submitBtn.disabled = true;
    cancelBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    spinner.style.display = 'block';

    const formData = new FormData(this);

    fetch(this.action, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
      })
      .then(data => {
        if (data.success) {
          alert('Payment initiated successfully! Check your phone for M-Pesa prompt');
          closePaymentModal();
        } else {
          throw new Error(data.message || 'Payment failed');
        }
      })
      .catch(error => {
        alert('Error: ' + error.message);
      })
      .finally(() => {
        submitBtn.disabled = false;
        cancelBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        spinner.style.display = 'none';
      });
  });
});
