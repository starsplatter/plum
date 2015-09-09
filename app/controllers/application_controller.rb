class ApplicationController < ActionController::Base
  before_action do
    resource = controller_path.singularize.tr('/', '_').to_sym
    method = "#{resource}_params"
    params[resource] &&= send(method) if respond_to?(method, true)
  end
  # Adds a few additional behaviors into the application controller
  include Blacklight::Controller

  # Adds CurationConcerns behaviors to the application controller.
  include CurationConcerns::ApplicationControllerBehavior
  include Hydra::Controller::ControllerBehavior
  include CurationConcerns::ThemedLayoutController
  with_themed_layout '1_column'

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  after_action :set_csrf_cookie_in_header

  private

    # Set XSRF-TOKEN in response headers (in addition to cookies)
    # This allows angular (or other clients) to round-trip the header
    def set_csrf_cookie_in_header
      cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
    end

    # Check if client (ie. angular) has submitted XSRF-TOKEN in header instead of url params
    def verified_request?
      super || valid_authenticity_token?(session, request.headers['X-XSRF-TOKEN'])
    end
end
