/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGEPROPERTY_H
#define DIALOGCOMMANDCHANGEPROPERTY_H

#include "dialogcommand.h"
#include "systemcommonobject.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeProperty
//
//  A dialog used for changing the property of the object.
//
// -------------------------------------------------------

#include <QDialog>

namespace Ui {
class DialogCommandChangeProperty;
}

class DialogCommandChangeProperty : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeProperty(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandChangeProperty();

    virtual EventCommand* getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

    void initializePrimitives();

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandChangeProperty *ui;

    void translate();
};

#endif // DIALOGCOMMANDCHANGEPROPERTY_H
