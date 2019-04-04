/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogsystemname.h"
#include "ui_dialogsystemname.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemName::DialogSystemName(SuperListItem& model, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemName),
    m_model(model)
{
    ui->setupUi(this);
    

    initialize();
}

DialogSystemName::~DialogSystemName()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemName::initialize(){
    ui->lineEditName->setText(m_model.name());
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemName::on_lineEditName_textChanged(const QString &text){
    m_model.setName(text);
}
