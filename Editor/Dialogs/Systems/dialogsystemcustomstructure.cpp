/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemcustomstructure.h"
#include "ui_dialogsystemcustomstructure.h"
#include "systemcustomstructureelement.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemCustomStructure::DialogSystemCustomStructure(SystemCustomStructure
    &custom, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemCustomStructure),
    m_custom(custom)
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogSystemCustomStructure::~DialogSystemCustomStructure()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemCustomStructure::initialize()
{
    ui->treeView->initializeModel(m_custom.model());
    ui->treeView->initializeNewItemInstance(new SystemCustomStructureElement(0,
        "", !m_custom.isList()));
    QModelIndex index = ui->treeView->getModel()->index(0, 0);
    ui->treeView->setCurrentIndex(index);
    RPM::get()->setSelectedList(m_custom.model());
    connect(ui->treeView, SIGNAL(windowClosed()), this, SLOT(
        on_treeviewWindowClosed()));
    connect(ui->treeView, SIGNAL(modelUpdated()), this, SLOT(on_modelUpdated()));
}

// -------------------------------------------------------

void DialogSystemCustomStructure::translate()
{
    ui->label->setText((m_custom.isList() ? "Custom list elements" :
        "Custom structure properties") + RPM::COLON);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemCustomStructure::on_treeviewWindowClosed()
{
    RPM::get()->setSelectedList(m_custom.model());
}

// -------------------------------------------------------

void DialogSystemCustomStructure::on_modelUpdated()
{
    if (m_custom.isList())
    {
        QStandardItem *item;
        SuperListItem *super;
        for (int i = 0, l = m_custom.model()->invisibleRootItem()->rowCount(); i
            < l; i++)
        {
            item = m_custom.model()->item(i);
            if (item != nullptr)
            {
                super = reinterpret_cast<SuperListItem *>(item->data().value<
                    quintptr>());
                if (super != nullptr)
                {
                    super->setId(i);
                }
            }
        }
        ui->treeView->updateAbsoluteAllNodesString();
    }
}
