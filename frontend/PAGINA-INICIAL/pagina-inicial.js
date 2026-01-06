$(document).ready(function() {
   
    if (typeof verificarLogin === 'function') {
        if (!verificarLogin()) return; 
    }

    const API_URL = 'https://jointed-judy-hypodermal.ngrok-free.dev';
    const token = localStorage.getItem('acess_token');

  
    function carregarPosts() {
        $.ajax({
            type: 'GET',
            url: `${API_URL}/social/posts/listar`, //
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(posts) {
                console.log('carregarPosts success', posts);
                $('#feed').empty();
                
                if (posts.length === 0) {
                    $('#feed').html('<p style="text-align:center; margin-top: 20px;">Nenhuma publicação encontrada.</p>');
                    return;
                }

              
                posts.reverse().forEach(post => {
                    const dataFormatada = new Date(post.criado_em).toLocaleString('pt-BR');
                    
                
                    const postHtml = `
                        <div class="post-card" data-id="${post.id}">
                            <div class="post-header">
                                <span class="post-author">${post.usuario}</span>
                                <span class="post-date">${dataFormatada}</span>
                            </div>
                            ${post.titulo ? `<div class="post-title">${post.titulo}</div>` : ''}
                            <div class="post-content">${post.conteudo}</div>
                            ${post.midia ? `<div class="post-media"><img src="${post.midia}" alt="Mídia do post"></div>` : ''}
                            
                            <div class="post-actions">
                                <button class="btn-acao btn-curtir">
                                    👍 ${post.curtidas} Curtir
                                </button>
                                <button class="btn-acao btn-responder">
                                    💬 ${post.respostas} Responder
                                </button>
                            </div>
                        </div>
                    `;
                    $('#feed').append(postHtml);
                });
            },
            error: function(erro) {
                console.error('Erro ao carregar posts:', erro);
                $('#feed').html('<p style="color:red; text-align:center">Erro ao carregar o feed.</p>');
            }
        });
    }

  
    carregarPosts();

   
    $('#form-publicar').on('submit', function(e) {
        e.preventDefault();

      
        const dadosPost = {
            titulo: $('#titulo-post').val() || null,
            conteudo: $('#conteudo-post').val(),
            midia: $('#midia-post').val() || null
        };

        $.ajax({
            type: 'POST',
            url: `${API_URL}/social/posts/criar`, //
            headers: {
                'Authorization': `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true'
            },
            contentType: 'application/json',
            data: JSON.stringify(dadosPost),
            success: function(resposta) {
                alert('Publicado com sucesso!');
                
                $('#titulo-post').val('');
                $('#conteudo-post').val('');
                $('#midia-post').val('');
              
                carregarPosts();
            },
            error: function(erro) {
                console.error('Erro ao publicar:', erro);
                alert('Erro ao criar publicação.');
            }
        });
    });

   
    $(document).on('click', '.btn-curtir', function() {
        const card = $(this).closest('.post-card');
        const id = card.data('id');
        
        $.ajax({
            type: 'POST',
            url: `${API_URL}/social/posts/${id}/curtir`, //
            headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
            success: function() {
                carregarPosts(); 
            },
            error: function(xhr) {
                if(xhr.status === 400) {
                    alert('Você já curtiu este post.');
                } else {
                    console.error(xhr);
                }
            }
        });
    });

   
    $(document).on('click', '.btn-responder', function() {
        const card = $(this).closest('.post-card');
        const id = card.data('id');
        
  
        const respostaConteudo = prompt("Escreva sua resposta:");
        
     
        if (respostaConteudo && respostaConteudo.trim() !== "") {
            const dadosResposta = {
                conteudo: respostaConteudo
            };

            $.ajax({
                type: 'POST',
                url: `${API_URL}/social/posts/${id}/responder`, 
                headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
                contentType: 'application/json',
                data: JSON.stringify(dadosResposta), 
                success: function(response) {
                    alert('Resposta enviada com sucesso!');
                    carregarPosts(); 
                },
                error: function(erro) {
                    console.error('Erro ao responder:', erro);
                    alert('Erro ao enviar resposta.');
                }
            });
        }
    });
});
