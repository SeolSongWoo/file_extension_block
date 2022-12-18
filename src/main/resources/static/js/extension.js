$(function (){
    $("input[name='BasicExtensionN']").on('click',BasicCheckBoxClick);
    $('#CustomExtensionAdd').on('click',CustomAddButtonClick);
    $("button[name=CustomBtnDelete]").on('click',CustomDeleteButtonClick);
});

//체크박스 클릭(고정확장자)
async function BasicCheckBoxClick() {
    const BasicValue = {
        Name : $(this).val(),
        Sort : 'BASIC'
    };

    if(BasicValue.Name == null || BasicValue.Name == '') {
        alert("잘못된 경로로 접근하였습니다.");
        return;
    }

    const ajax = new ExtensionAjax(BasicValue);

    if($(this).is(":checked")) {
        await ajax.add('POST','/extensionadd');
    }else {
        await ajax.del('DELETE','/extensiondel');
    }
}

//커스텀 확장자 추가 버튼 클릭
async function CustomAddButtonClick () {
    let CustomValue = $('#CustomExtensionText').val().replace(/ /g, '');
    const regex = /^[a-z|A-Z|0-9|]+$/;

    if(!regex.test(CustomValue)) {
        alert("알파벳과 숫자만 입력이 가능합니다.");
        return;
    }
    else if(CustomValue.length > 20) {
        alert("최대 입력 길이는 20글자입니다.");
        return;
    }
    try {
        $("input[name='BasicExtensionN']").each(function () {
            if (this.value == CustomValue) {
                throw '고정 확장자로 등록되어있는 확장자입니다.';
            }
        });
    } catch (Exception) {
        alert(Exception);
        return;
    }

    CustomValue = {
        Name : CustomValue,
        Sort : 'CUSTOM'
    };
    const ajax = new ExtensionAjax(CustomValue);
    await ajax.add('POST','/extensionadd');
}

//커스텀 확장자 삭제 버튼
async function CustomDeleteButtonClick (){
    let CustomValue = {
        Name : $(this).val(),
        Sort : 'CUSTOM'
    };
    if(CustomValue.Name == null || CustomValue.Name == '') {
        alert("잘못된 경로로 접근하였습니다.");
        return;
    }
    const ajax = new ExtensionAjax(CustomValue);
    await ajax.del('DELETE','/extensiondel');
}


/**
 * 확장자 설정 클래스
 */
class ExtensionAjax{

    /**
     * Ajax Body Constructor
     * @Param Only Json Object
     * @description JsonObject must have 'Name' and 'Sort'.
     */
    constructor(Value) {
        this.Value = Value;
    }

    /**
     * Extension Add
     * @Param Http Method = 'GET,POST,DELETE,PUT'
     * @Param url = 'URI Adress'
     */
    async add(Type,url) {
        const Value = this.Value;
        if(Type === null || Value.Sort === null || Value.Name === null){
            return new Error ('Object NULL Exception');
        }else {
            const result = await this.#Ajax(Type,url,Value);
            if(result === 1) {
                return;
            }else {
                return new Error ('Ajax Failed');
            }
        }
    }

    /**
     * Extension Del
     * @Param Http Method = 'GET,POST,DELETE,PUT'
     * @Param url = 'URI Adress'
     */
    async del(Type,url) {
        const Value = this.Value;
        if(Type === null || Value.Sort === null || Value.Name === null){
            return new Error('Object NULL Exception');
        }else {
            const result = await this.#Ajax(Type,url,Value);
            if(result === 1) {
                return;
            }else {
                return new Error ('Ajax Failed');
            }
        }
    }

    #Ajax(Type,url,Value) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    type : Type
                    , url : url
                    , dataType : "json"
                    , data : Value
                    , success : function(res){
                        resolve(1);
                        if(res.rt == "ok"){
                            location.reload();
                        }else if(res.rt == "Null") {
                            alert("정상적인 경로로 접근해주십시오.");
                        }else {
                            alert(res.rt);
                            return;
                        }
                    }
                    , beforeSend: function() {
                        $('#loading').show();
                    }
                    , complete: function() {
                        $('#loading').hide();
                    }
                    , error: function(request,status,error) {
                        reject(0);
                        alert(`ERROR CODE:"${request.status}\n 서버와의 통신에 실패하였습니다.`);
                    }
                });
            });
    }

}