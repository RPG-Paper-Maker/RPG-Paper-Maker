/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDSCRIPT_H
#define DIALOGCOMMANDSCRIPT_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandScript
//
//  A dialog used for executing a script.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandScript;
}

class DialogCommandScript : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandScript(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandScript();

    void getCommandList(QVector<QString> &command) const;

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

    void initializePrimitives();

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandScript *ui;

    void translate();

public slots:
    void on_checkBoxDynamic_toggled(bool checked);
};

#endif // DIALOGCOMMANDSCRIPT_H
