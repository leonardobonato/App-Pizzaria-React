import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';


function App() {
  const { register, handleSubmit, reset, setFocus, watch } = useForm()

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [burger, setBurger] = useState([])
  const [modalFoto, setModalFoto] = useState("")
  const [modalNome, setModalNome] = useState("")
  const [modalIngredientes, setModalIngredientes] = useState("")

  function onOpenModal() {
    setOpen(true)
  }

  function onCloseModal() {
    setOpen(false)
  }

  function onOpenModal2() {
    setOpen2(true)
  }

  function onCloseModal2() {
    setOpen2(false)
  }


  function gravaBurger(data) {
    const burger2 = [...burger]
    burger2.push({ nome: data.nome, ingredientes: data.ingredientes, imagem: data.imagem })
    setBurger(burger2)
    setFocus("nome")
    reset({ nome: "", ingredientes: "", imagem: "" })

    localStorage.setItem("burger", JSON.stringify(burger2))
  }

  useEffect(() => {
    if (localStorage.getItem("burger")) {
      const burger2 = JSON.parse(localStorage.getItem("burger"))
      setBurger(burger2)
    }
  }, [])

  function mostraBurger(indice) {
    const burgers = burger[indice]
    setModalFoto(burgers.imagem)
    setModalNome(burgers.nome)
    setModalIngredientes(burgers.ingredientes)
    setOpen2(true)
  }

  function excluiBurger(indice) {
    const burgers = burger[indice]
    Swal.fire({
      title: 'Deseja excluir o Burger do cardápio?',
      text: "Para visualizar futuramente, terá que cadastrá-lo",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#008000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, quero excluir!',
      cancelButtonText: 'Não excluir'
    }).then((result) => {
      if (result.isConfirmed) {
        const burger2 = [...burger]
        burger2.splice(indice, 1)
        setBurger(burger2)
        localStorage.setItem("burger", JSON.stringify(burger2))
        Swal.fire(
          'Excluído!',
          'O Burger foi excluído do cardápio',
          'success'
        ).then(() => {
          // Após o usuário clicar em "OK" e a notificação de sucesso ser fechada, a página será atualizada e nenhum item permanecerá no componente visual nem no localStorage
          window.location.reload()
        })
      }
    })
  }

  const listaBurger = burger.map((burgerItem, indice) => (
    <tr key={burgerItem.nome}>
      <td>{burgerItem.nome}</td>
      <td>{burgerItem.ingredientes}</td>
      <td>
        <img src={burgerItem.imagem} width={150} height={100} alt={`Burger: ${burgerItem.nome}`} />
      </td>
      {/* parte das ações que o usuário pode fazer na página, consultar item ou excluir item */}
      <td><i className="bi bi-search fs-4 text-success" title='Consultar' style={{ cursor: 'pointer' }} onClick={() => mostraBurger(indice)}></i>
        <i class="bi bi-trash fs-4 text-danger ms-2" title='Excluir' style={{ cursor: 'pointer' }} onClick={() => excluiBurger(indice)}></i>
      </td>
    </tr>
  ));


  return (
    <div className="container-fluid">
      <nav className="navbar bg-danger">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#">
            <img src="./logo.png" alt="Logo" width="48" height="36" className="d-inline-block align-text-top" /> Cardápio</a>
        </div>
      </nav>

      <div className="container mt-3">
        <h2 className="d-flex justify-content-between">
          <span>Listagem dos Burgers</span>
          <button className="btn btn-success" onClick={onOpenModal}>Adicionar</button> {/*onClick pra que quando clique abra o modal  */}
        </h2>

        <table className="table table-hover mt-5">
          <thead>

            <tr>

              <th>Nome do Burger</th>
              <th>Ingredientes</th>
              <th>Imagem</th>
              <th>Ações</th>

            </tr>

          </thead>

          <tbody>
            {listaBurger}
          </tbody>

        </table>
      </div>

      {/* Quando o usuário clicar no botão adicionar vai abrir essa caixinha aqui e o que tiver aqui dentro será exibido */}
      <Modal open={open} onClose={onCloseModal} center>

        <div className="card">
          <div className="card-header">
            Inclusão de Burger no cardápio
          </div>

          <form className="card-body" onSubmit={handleSubmit(gravaBurger)}>
            <h5 className="card-title">Informe os detalhes do Burger</h5>

            <div className="mb-3">
              <label htmlFor="nome" className="form-label">Nome do Burger</label>
              <input type="text" className="form-control" id="nome" placeholder="Insira o nome do Burger" {...register("nome")} required />
            </div>

            <div className="mb-3">
              <label htmlFor="ingredientes" className="form-label">Ingredientes</label>
              <textarea className="form-control" id="ingredientes" rows="3" {...register("ingredientes")} required></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="imagem" className="form-label">Imagem do Burger</label>
              <input type="text" className="form-control" id="iamgem" placeholder="Informe a URL da imagem" {...register("imagem")} required />
            </div>

            <input type="submit" className='btn btn-success' value="Enviar" />
          </form>
          {/* tem algum conteúdo pro campo foto? se tiver executa o comando da img. Se não houver um conteúdo pra esse campo, não faz nada */}
          {watch("imagem") &&
            <img src={watch("imagem")} alt="Foto do Burger" width={240} height={200} className='rounded mx-auto d-block' />
          }
        </div>
      </Modal>

      <Modal open={open2} onClose={onCloseModal2} center>

        <div class="card" >
          <img src={modalFoto} class="card-img-top" alt="Burger" width={500} height={400}/>
            <div class="card-body">
              <h5 class="card-title">{modalNome}</h5>
              <p class="card-text">{modalIngredientes}</p>
              <a href="#" class="btn btn-primary">Incluir no pedido</a>
            </div>
        </div>

      </Modal>

    </div>
  )
}

export default App
