/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDPLUGIN_H
#define DIALOGCOMMANDPLUGIN_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandPlugin
//
//  A dialog calling a plugin command.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandPlugin;
}

class DialogCommandPlugin : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandPlugin(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    ~DialogCommandPlugin();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_currentParameters;

    void initializePrimitives();
    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandPlugin *ui;

    void translate();

public slots:
    void on_comboBoxPlugin_currentIndexChanged(int index);
    void on_comboBoxCommand_currentIndexChanged(int index);
};

#endif // DIALOGCOMMANDPLUGIN_H
