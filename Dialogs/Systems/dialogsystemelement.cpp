/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogsystemelement.h"
#include "ui_dialogsystemelement.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemElement::DialogSystemElement(SystemElement& element,
                                         QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemElement),
    m_element(element)
{
    ui->setupUi(this);
    
    initialize();
}

DialogSystemElement::~DialogSystemElement()
{
    delete ui;
}

SystemElement& DialogSystemElement::element() const { return m_element; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemElement::initialize(){
    ui->widgetTxtLangName->initializeNamesLang(&m_element);

    ui->treeViewEfficiency->setModel(m_element.efficiency());
    ui->treeViewEfficiency->setColumnWidth(0,250);
}
