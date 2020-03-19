/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogvariables.h"
#include "systemvariables.h"
#include "ui_dialogvariables.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogVariables::DialogVariables(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogVariables)
{
    ui->setupUi(this);
    

    ui->panelList->showButtonMax(false);
    ui->panelListPages->list()->initializeNewItemInstance(new SystemVariables);
    ui->panelListPages->setMaximumLimit(400);

    this->translate();
}

DialogVariables::~DialogVariables()
{
    delete ui;
}

void DialogVariables::initializeModel(QStandardItemModel* m){
    ui->panelListPages->initializeModel(m);

    // Connection
    connect(ui->panelListPages->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageSelected(QModelIndex,QModelIndex)));

    QModelIndex index = ui->panelListPages->list()->getModel()->index(0,0);
    ui->panelListPages->list()->setCurrentIndex(index);
    on_pageSelected(index, index);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int DialogVariables::getSelectedId() const{
    QStandardItem* selected = ui->panelList->list()->getModel()
            ->itemFromIndex(ui->panelList->list()->selectionModel()
                            ->currentIndex());
    return ((SuperListItem*)selected->data().value<quintptr>())->id();
}

//-------------------------------------------------

void DialogVariables::translate()
{
    this->setWindowTitle(RPM::translate(Translations::VARIABLES_MANAGER) + RPM
        ::DOT_DOT_DOT);
    ui->groupBoxVariables->setTitle(RPM::translate(Translations::VARIABLES));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogVariables::on_pageSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelListPages->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr){
        ui->panelList->initializeModel(((SystemVariables*)selected->data()
                                        .value<quintptr>())->model());
        ui->panelList->list()->setCurrentIndex(ui->panelList->list()
                                               ->getModel()->index(0,0));
    }
}

// -------------------------------------------------------

void DialogVariables::on_buttonBox_clicked(QAbstractButton *button){
    if((QPushButton*)button == ui->buttonBox->button(QDialogButtonBox::Ok)){
        RPM::writeJSON(Common::pathCombine(RPM::get()->project()
                                            ->pathCurrentProject(),
                                            RPM::PATH_VARIABLES),
                         *(RPM::get()->project()->gameDatas()
                           ->variablesDatas()));
    }
    else if ((QPushButton*)button == ui->buttonBox
             ->button(QDialogButtonBox::Cancel))
    {
        RPM::get()->project()->gameDatas()
                ->readVariablesSwitches(RPM::get()->project()
                                        ->pathCurrentProject());
    }
}
