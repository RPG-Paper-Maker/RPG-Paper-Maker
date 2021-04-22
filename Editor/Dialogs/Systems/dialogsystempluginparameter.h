/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMPLUGINPARAMETER_H
#define DIALOGSYSTEMPLUGINPARAMETER_H

#include <QDialog>
#include "systempluginparameter.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemPluginParameter
//
//  A dialog used for editing the model of a system plugin parameter.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemPluginParameter;
}

class DialogSystemPluginParameter : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemPluginParameter(SystemPluginParameter &parameter,
        QWidget *parent = nullptr);
    ~DialogSystemPluginParameter();

    void initialize();

protected:
    virtual void accept();

private:
    Ui::DialogSystemPluginParameter *ui;
    SystemPluginParameter &m_parameter;
    QString m_previousName;

    void translate();

public slots:
    void on_lineEditName_textEdited(const QString &text);
    void on_lineEditDescription_textEdited(const QString &text);
    void on_kindUpdated(PrimitiveValueKind kind);
    void on_checkBoxMin_toggled(bool checked);
    void on_checkBoxMax_toggled(bool checked);
    void on_spinBoxMin_valueChanged(int i);
    void on_spinBoxMax_valueChanged(int i);
};

#endif // DIALOGSYSTEMPLUGINPARAMETER_H
