create database bankserver;

use bankserver;


drop table if exists rekening;
create table rekening (
	id int(11) unsigned primary key auto_increment not null,
	bankcode varchar(45) not null,
	IBAN varchar(45) not null,
	BIC varchar(45) not null,
	pas_number int(11),
	type varchar(45) not null,
	status varchar(45) not null,
	current int(11) not null,
	savings int(11) not null
);


drop table if exists customer;
create table customer (
	id int(11) unsigned primary key auto_increment not null,
	firstname varchar(45) not null,
	surname varchar(45) not null,
	birth_of_date date not null,
	address varchar(45) not null,
	postcode varchar(45) not null,
	residence varchar(45) not null,
	country varchar(45) not null,
	phone int(11) null
);


drop table if exists transaction;
create table transaction (
	id int(11) unsigned primary key auto_increment not null,
	date datetime not null,
	start_rekeningnumber int(11) unsigned not null,
	end_rekeningnumber int(11) unsigned not null,
       	start_bank varchar(45) not null,
	end_bank varchar(45) not null,
	start_location varchar(45) not null,
	end_location varchar(45) not null,
	start_amount int(11) not null,
	end_amount int(11) not null,
	difference_amount int(11) null,
	total_amount int(11) not null	
);


drop table if exists account;
create table account (
	id int(11) unsigned primary key auto_increment not null,
	username varchar(45) not null,
	email varchar(45) not null,
	password varchar(45) not null,
	rekeningID int(11) unsigned not null,
	transactionID int(11) unsigned not null,
	customerID int(11) unsigned not null,

	foreign key (rekeningID) references rekening(id),
	foreign key (transactionID) references transaction(id),
	foreign key (customerID) references customer(id)
);
