url = "/pessoas/";

formPessoa = document.querySelector("form");
formPessoa.style.display = "none"

formPessoa.addEventListener("submit", (event) => {
  event.preventDefault();
  const dataPessoa = new FormData(formPessoa);
  dataPost = Object.fromEntries(dataPessoa);
  let statusButton = document.getElementById("salvarPessoa").innerText;

  if(formPessoa.checkValidity() == false){
    swal({
      title: "Existem campos vazios",
      text: "Preencha os campos vazios e tente novamente",
      icon: "warning",
      dangerMode: true,
    })
    return
  }


  if (statusButton.trim() == 'Salvar') {
    salvarPessoa(dataPost);
  } else {
    atualizarPessoa(dataPost);
  }
});

function mostrarForm(status){
  if(status == `Salvar`){
    document.getElementById("salvarPessoa").innerHTML = `<i class="fa-solid fa-floppy-disk""></i> Salvar`;
  }else{
    document.getElementById("salvarPessoa").innerHTML = `<i class="fa-solid fa-floppy-disk""></i> Atualizar`;
  }
  formPessoa.style.display = "block"
  document.getElementById('tablePessoa').style.display = "none"
}

function mostrarTable(){
  formPessoa.style.display = "none"
  document.getElementById('tablePessoa').style.display = "block"
  document.getElementById("idPessoa").value = ""
}

function salvarPessoa(dados) {
  delete dados.id
  fetch(url, {
    method: "POST",
    body: JSON.stringify(dados),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((pessoa) => {
      console.log(pessoa);
      formPessoa.reset();
      formPessoa.classList.remove("was-validated");
      mostrarTable()
      pegarPessoas();
      document.getElementById("idPessoa").value = ""
      swal({
        title: "Cadastro com sucesso",
        text: `A pessoa ${pessoa.nome.split(" ")[0].toUpperCase()} foi adicionado com sucesso`,
        icon: "success"
      })
    }).catch((err) => {
      console.log(err);
    });
}

function atualizarPessoa(dados) {
  console.log("update", dados);
  fetch(url + dados.id, {
    method: "PATCH",
    body: JSON.stringify(dados),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((pessoa) => {
      console.log(pessoa);
      formPessoa.reset();
      formPessoa.classList.remove("was-validated");
      mostrarTable()
      pegarPessoas();
      document.getElementById("idPessoa").value = ""
      swal({
        title: "Atualizado com sucesso",
        text: `A pessoa ${pessoa.nome.split(" ")[0].toUpperCase()}  foi atualizada com sucesso`,
        icon: "success"
      })

    }).catch(err => {
      console.log(err);
    });
}

function editarPessoa(id) {
  document.getElementById("salvarPessoa").innerHTML = `<i class="fa-solid fa-floppy-disk""></i> Atualizar`;
  // atualizarPessoa
  console.log("editar", id);
  fetch(url + id)
    .then((res) => {
      return res.json();
    })
    .then((pessoa) => {
      document.getElementById("idPessoa").value = pessoa.id;
      document.getElementById("nome").value = pessoa.nome;
      document.getElementById("idade").value = pessoa.idade;
      document.getElementById("email").value = pessoa.email;
      mostrarForm('Atualizar')
    });
}

function deletarPessoa(id) {
  // removerPessoa
  console.log("excluir", id);
  fetch(url + id, {
    method: "DELETE",
  }).then((res)=>{
    return res.json()
  }).then((pessoa)=>{
    console.log('foi deletado',pessoa)
    pegarPessoas()
    swal({
      title: "Deletado com sucesso",
      text: `A pessoa ${id} foi deletada com sucesso`,
      icon: "success"
    })
  });
}

function pegarPessoas() {
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((pessoas) => {
      console.log(pessoas);
      listaPessoas = "";
      for (let pessoa of pessoas) {
        listaPessoas += `
      <tr>
          <th scope="row">${pessoa.id}</th>
          <td>${pessoa.nome}</td>
          <td>${pessoa.idade}</td>
          <td>${pessoa.email}</td>
          <td>
            <button onclick="editarPessoa(${pessoa.id})" class="btn btn-primary"><i class="fa-solid fa-edit"></i></button>
            <button onclick="deletarPessoa(${pessoa.id})" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
          </td>
      </tr>
      `;
      }
      document.querySelector("tbody").innerHTML = listaPessoas;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const buttonSearch = document.getElementById("buttonSearch");
    const buttonReset = document.getElementById("buttonReset");

    buttonSearch.addEventListener("click", function () {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filterTable(searchTerm);
    });

    buttonReset.addEventListener("click", function () {
        searchInput.value = "";
        filterTable("");
    });

    function filterTable(searchTerm) {
        const tableRows = document.querySelectorAll("#tablePessoa table tbody tr");

        tableRows.forEach(function (row) {
            const nomeCell = row.querySelector("td:nth-child(2)");
            if (nomeCell) {
                const nomeText = nomeCell.textContent.toLowerCase();
                if (nomeText.includes(searchTerm)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            }
        });
    }
});


pegarPessoas();

