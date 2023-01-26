/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetvariable.h"
#include "ui_widgetvariable.h"
#include "superlistitem.h"
#include "dialogvariables.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetVariable::WidgetVariable(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetVariable),
    m_super(nullptr)
{
    ui->setupUi(this);

    ui->listWidget->addItem(new QListWidgetItem);
}

WidgetVariable::~WidgetVariable()
{
    delete ui;
}

int WidgetVariable::currentId() const { return p_currentId; }

void WidgetVariable::setCurrentId(int i) {
    if (i < 1) i = 1;
    p_currentId = i;

    VariablesDatas* datas = RPM::get()->project()->gameDatas()
                                    ->variablesDatas();

    // Graphic update
    SuperListItem* s = datas->getVariableById(p_currentId);

    if (s == nullptr){
        p_currentId = 1;
        s = datas->getVariableById(p_currentId);
    }
    ui->listWidget->item(0)->setText(s->toString());

    // Super
    if (m_super != nullptr) {
        m_super->setId(p_currentId);
    }
}

QListWidget* WidgetVariable::list() const { return ui->listWidget; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetVariable::initialize(int i) {
    setCurrentId(i);
}

// -------------------------------------------------------

void WidgetVariable::initializeSuper(SuperListItem *super) {
    m_super = super;
    initialize(super->id());
}

// -------------------------------------------------------

void WidgetVariable::openDialog(){
    DialogVariables dialog(p_currentId);
    VariablesDatas* datas = RPM::get()->project()->gameDatas()
                                    ->variablesDatas();
    QStandardItemModel* m = datas->model();

    dialog.initializeModel(m);
    if (dialog.exec() == QDialog::Accepted){
        setCurrentId(dialog.getSelectedId());
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetVariable::on_listWidget_itemDoubleClicked(QListWidgetItem*){
    openDialog();
}

// -------------------------------------------------------

void WidgetVariable::on_pushButton_clicked(){
    openDialog();
}
