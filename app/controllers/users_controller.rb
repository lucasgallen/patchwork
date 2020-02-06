class UsersController < ApplicationController
  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if params[:user][:password].blank?
      params[:user].delete(:password) 
    end
    
    if params[:user][:password].blank? && params[:user][:password_confirmation].blank?
      params[:user].delete(:password_confirmation)
    end

    if @user.update(user_params)
      flash[:notice] = "Successfully updated User."
      redirect_to root_path
    else
      render :action => 'edit'
    end
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
