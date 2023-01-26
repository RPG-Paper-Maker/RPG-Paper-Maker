/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemelement.h"
#include "ui_dialogsystemelement.h"
#include "rpm.h"

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

    this->translate();
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
    ui->widgetIcon->initializeIcon(&m_element);
    ui->treeViewEfficiency->initializeModel(m_element.modelEfficiency());
    ui->treeViewEfficiency->setColumnWidth(0,250);
    ui->treeViewEfficiency->setCanBeEmpty(false);
    ui->treeViewEfficiency->setCanMove(false);
    ui->treeViewEfficiency->setCanCreateDelete(false);
}

//-------------------------------------------------

void DialogSystemElement::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_ELEMENT) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->groupBoxEfficiency->setTitle(RPM::translate(Translations::EFFICIENCY));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
