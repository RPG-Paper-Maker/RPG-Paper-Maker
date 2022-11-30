/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogobject.h"
#include "ui_dialogobject.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogObject::DialogObject(SystemCommonObject *object, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogObject),
    m_object(object)
{
    ui->setupUi(this);

    ui->widget->initializeDialog(this);
    ui->widget->initializeList(RPM::get()->project()->gameDatas()
                               ->commonEventsDatas()->modelCommonObjects());
    ui->widget->initializeModel(object);
    ui->widget->updateModel();

    this->translate();
}

DialogObject::~DialogObject()
{
    delete ui;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogObject::accept()
{
    // If a state contains a graphic object 3D not added in current tileset
    QStandardItemModel *modelObjects3D = RPM::get()->project()->currentMap(true)
        ->mapProperties()->tileset()->model3DObjects();
    SystemState *state;
    SystemObject3D *object3D;
    int id;
    bool changedObject3D = false;
    for (int i = 0, l = m_object->modelStates()->invisibleRootItem()->rowCount();
        i < l; i++)
    {
        state = reinterpret_cast<SystemState *>(SuperListItem::getItemModelAt(
            m_object->modelStates(), i));
        if (state != nullptr && state->graphicsKind() ==
            MapEditorSubSelectionKind::Object3D)
        {
            id = state->graphicsId();
            object3D = reinterpret_cast<SystemObject3D *>(SuperListItem::getById(
                modelObjects3D->invisibleRootItem(), id, false));
            if (object3D == nullptr)
            {
                object3D = reinterpret_cast<SystemObject3D *>(SuperListItem
                    ::getById(RPM::get()->project()->specialElementsDatas()
                    ->modelObjects3D()->invisibleRootItem(), id, false));
                if (object3D != nullptr)
                {
                    modelObjects3D->appendRow((new SuperListItem(id, object3D
                        ->name()))->getModelRow());
                    changedObject3D = true;
                }
            }
        }
    }

    // Save 3D objects
    if (changedObject3D)
    {
        RPM::get()->project()->currentMap(true)->setNeedReloadObjects3DTextures(true);
        RPM::get()->project()->writeTilesetsDatas();
    }
    QDialog::accept();
}

//-------------------------------------------------

void DialogObject::translate()
{
    this->setWindowTitle(RPM::translate(Translations::OBJECT) + RPM::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
