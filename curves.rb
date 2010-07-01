require 'rubygems'
require 'sinatra'
require 'erb'

get '/' do
  erb :curves
end

get '/collision' do
  erb :collision
end

get '/dp' do
  erb :douglas_peucker
end

get '/angles' do
  erb :angles
end
