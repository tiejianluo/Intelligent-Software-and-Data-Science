class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  
  def hello
  	render html: "1  ---hello,world!,你好！"
  end
end
